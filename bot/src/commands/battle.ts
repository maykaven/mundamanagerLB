import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { supabase } from '../supabase.js';
import { battleEmbed, errorEmbed, successEmbed, warningEmbed, BattleEmbedData } from '../embeds/index.js';
import { generateBattleNarrative } from '../services/narrative.js';
import { getNotificationService } from '../services/notification.js';

/**
 * Helper: resolve the Supabase profile for the calling Discord user.
 */
async function getLinkedProfile(discordId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('discord_id', discordId)
    .single();
  return data;
}

export default {
  data: new SlashCommandBuilder()
    .setName('battle')
    .setDescription('Report and confirm battles')
    .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
      sub
        .setName('report')
        .setDescription('Report a battle result')
        .addStringOption(opt =>
          opt.setName('campaign').setDescription('Select campaign').setRequired(true).setAutocomplete(true)
        )
        .addStringOption(opt =>
          opt.setName('winner').setDescription('Winning gang').setRequired(true).setAutocomplete(true)
        )
        .addStringOption(opt =>
          opt.setName('loser').setDescription('Losing gang').setRequired(true).setAutocomplete(true)
        )
        .addStringOption(opt =>
          opt.setName('scenario').setDescription('Battle scenario (optional)')
        )
        .addStringOption(opt =>
          opt.setName('location').setDescription('Battle location (optional)')
        )
        .addBooleanOption(opt =>
          opt.setName('draw').setDescription('Was it a draw? (ignores winner/loser distinction)')
        )
    )
    .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
      sub
        .setName('confirm')
        .setDescription('Confirm or dispute a reported battle')
        .addStringOption(opt =>
          opt.setName('battle').setDescription('Select battle to confirm').setRequired(true).setAutocomplete(true)
        )
        .addBooleanOption(opt =>
          opt.setName('dispute').setDescription('Dispute this battle result?')
        )
        .addStringOption(opt =>
          opt.setName('notes').setDescription('Notes (especially if disputing)')
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'report':
        return handleReport(interaction);
      case 'confirm':
        return handleConfirm(interaction);
    }
  },
};

async function handleReport(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const profile = await getLinkedProfile(interaction.user.id);
  if (!profile) {
    await interaction.editReply({
      embeds: [errorEmbed('Not Linked', 'Link your Discord account first with `/link`.')],
    });
    return;
  }

  const campaignId = interaction.options.getString('campaign', true);
  const winnerId = interaction.options.getString('winner', true);
  const loserId = interaction.options.getString('loser', true);
  const scenario = interaction.options.getString('scenario');
  const location = interaction.options.getString('location');
  const isDraw = interaction.options.getBoolean('draw') || false;

  // Verify campaign exists
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('id, campaign_name')
    .eq('id', campaignId)
    .single();

  if (!campaign) {
    await interaction.editReply({ embeds: [errorEmbed('Campaign not found')] });
    return;
  }

  // Fetch both gangs with their owners and gang type
  const { data: winnerGang } = await supabase
    .from('gangs')
    .select('id, name, gang_type, user_id')
    .eq('id', winnerId)
    .single();

  const { data: loserGang } = await supabase
    .from('gangs')
    .select('id, name, gang_type, user_id')
    .eq('id', loserId)
    .single();

  if (!winnerGang || !loserGang) {
    await interaction.editReply({ embeds: [errorEmbed('Gang not found', 'One or both gangs could not be found.')] });
    return;
  }

  // Verify the reporting user owns one of the gangs or is campaign admin
  const isOwner = winnerGang.user_id === profile.id || loserGang.user_id === profile.id;
  if (!isOwner) {
    const { data: membership } = await supabase
      .from('campaign_members')
      .select('role')
      .eq('campaign_id', campaignId)
      .eq('user_id', profile.id)
      .single();

    if (!membership || !['ADMIN', 'OWNER', 'ARBITRATOR'].includes(membership.role)) {
      await interaction.editReply({
        embeds: [errorEmbed('Permission Denied', 'You must own one of the participating gangs or be a campaign admin.')],
      });
      return;
    }
  }

  // Generate AI narrative
  const narrative = await generateBattleNarrative({
    winnerGang: winnerGang.name,
    winnerHouse: winnerGang.gang_type || 'Unknown',
    loserGang: loserGang.name,
    loserHouse: loserGang.gang_type || 'Unknown',
    location: location || undefined,
    scenario: scenario || undefined,
    isDraw,
  });

  // Insert battle record
  const { data: battle, error: insertError } = await supabase
    .from('campaign_battles')
    .insert({
      campaign_id: campaignId,
      attacker_id: winnerId,
      defender_id: loserId,
      winner_id: isDraw ? null : winnerId,
      scenario: scenario || null,
      note: location ? `Location: ${location}` : null,
      narrative,
    })
    .select('id')
    .single();

  if (insertError || !battle) {
    console.error('Failed to insert battle:', insertError);
    await interaction.editReply({ embeds: [errorEmbed('Failed to record battle')] });
    return;
  }

  // Insert narrative into campaign_narratives table
  await supabase.from('campaign_narratives').insert({
    campaign_id: campaignId,
    narrative_type: 'BATTLE',
    narrative_text: narrative,
    related_battle_id: battle.id,
    metadata: {
      winner: winnerGang.name,
      loser: loserGang.name,
      scenario,
      location,
      isDraw,
      reported_by: profile.username,
    },
  });

  // Build and send the battle embed
  const embedData: BattleEmbedData = {
    id: battle.id,
    campaignName: campaign.campaign_name,
    winnerName: winnerGang.name,
    loserName: loserGang.name,
    winnerHouse: winnerGang.gang_type || 'Unknown',
    loserHouse: loserGang.gang_type || 'Unknown',
    scenario,
    location,
    narrative,
    isDraw,
  };

  await interaction.editReply({ embeds: [battleEmbed(embedData)] });

  // Notify opponent via DM
  const opponentUserId = winnerGang.user_id === profile.id ? loserGang.user_id : winnerGang.user_id;
  const notificationSvc = getNotificationService();
  if (notificationSvc && opponentUserId) {
    const dmEmbed = battleEmbed(embedData);
    dmEmbed.setTitle('Battle Reported Against You!');
    dmEmbed.addFields({
      name: 'Action Required',
      value: 'Use `/battle confirm` to confirm or dispute this result.',
    });
    await notificationSvc.sendDM(opponentUserId, dmEmbed);
  }
}

async function handleConfirm(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const profile = await getLinkedProfile(interaction.user.id);
  if (!profile) {
    await interaction.editReply({
      embeds: [errorEmbed('Not Linked', 'Link your Discord account first with `/link`.')],
    });
    return;
  }

  const battleId = interaction.options.getString('battle', true);
  const isDispute = interaction.options.getBoolean('dispute') || false;
  const notes = interaction.options.getString('notes');

  // Fetch the battle
  const { data: battle } = await supabase
    .from('campaign_battles')
    .select('id, campaign_id, attacker_id, defender_id, winner_id, narrative, note')
    .eq('id', battleId)
    .single();

  if (!battle) {
    await interaction.editReply({ embeds: [errorEmbed('Battle not found')] });
    return;
  }

  // Fetch both gangs to verify ownership
  const { data: attackerGang } = await supabase
    .from('gangs')
    .select('id, name, gang_type, user_id')
    .eq('id', battle.attacker_id)
    .single();

  const { data: defenderGang } = await supabase
    .from('gangs')
    .select('id, name, gang_type, user_id')
    .eq('id', battle.defender_id)
    .single();

  if (!attackerGang || !defenderGang) {
    await interaction.editReply({ embeds: [errorEmbed('Could not find battle participants')] });
    return;
  }

  // Verify user owns one of the participating gangs
  const isAttackerOwner = attackerGang.user_id === profile.id;
  const isDefenderOwner = defenderGang.user_id === profile.id;
  if (!isAttackerOwner && !isDefenderOwner) {
    await interaction.editReply({
      embeds: [errorEmbed('Permission Denied', 'You must own one of the participating gangs.')],
    });
    return;
  }

  if (isDispute) {
    // Update battle note with dispute
    const disputeNote = `DISPUTED by ${profile.username}${notes ? `: ${notes}` : ''}`;
    const updatedNote = battle.note ? `${battle.note}\n${disputeNote}` : disputeNote;

    await supabase
      .from('campaign_battles')
      .update({ note: updatedNote })
      .eq('id', battleId);

    await interaction.editReply({
      embeds: [warningEmbed('Battle Disputed', `You have disputed this battle result.${notes ? `\nReason: ${notes}` : ''}`)],
    });

    // Notify the other player
    const otherUserId = isAttackerOwner ? defenderGang.user_id : attackerGang.user_id;
    const notificationSvc = getNotificationService();
    if (notificationSvc && otherUserId) {
      const dmEmbed = warningEmbed(
        'Battle Disputed',
        `**${profile.username}** has disputed a battle result.${notes ? `\nReason: ${notes}` : ''}`
      );
      await notificationSvc.sendDM(otherUserId, dmEmbed);
    }
  } else {
    // Confirm the battle
    const confirmNote = `Confirmed by ${profile.username}`;
    const updatedNote = battle.note ? `${battle.note}\n${confirmNote}` : confirmNote;

    await supabase
      .from('campaign_battles')
      .update({ note: updatedNote })
      .eq('id', battleId);

    await interaction.editReply({
      embeds: [successEmbed('Battle Confirmed', 'You have confirmed this battle result.')],
    });

    // Post narrative to timeline channel
    const notificationSvc = getNotificationService();
    if (notificationSvc && battle.narrative) {
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('campaign_name')
        .eq('id', battle.campaign_id)
        .single();

      const timelineEmbed = battleEmbed({
        id: battle.id,
        campaignName: campaign?.campaign_name || 'Unknown',
        winnerName: attackerGang.name,
        loserName: defenderGang.name,
        winnerHouse: attackerGang.gang_type || 'Unknown',
        loserHouse: defenderGang.gang_type || 'Unknown',
        narrative: battle.narrative,
        isDraw: !battle.winner_id,
      });

      await notificationSvc.postToTimeline(battle.campaign_id, timelineEmbed);
    }

    // Notify the other player
    const otherUserId = isAttackerOwner ? defenderGang.user_id : attackerGang.user_id;
    if (notificationSvc && otherUserId) {
      const dmEmbed = successEmbed(
        'Battle Confirmed',
        `**${profile.username}** has confirmed a battle result.`
      );
      await notificationSvc.sendDM(otherUserId, dmEmbed);
    }
  }
}

