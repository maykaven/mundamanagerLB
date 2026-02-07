import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, SlashCommandSubcommandBuilder } from 'discord.js';
import { supabase } from '../supabase.js';
import { successEmbed, errorEmbed } from '../embeds/index.js';

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
    .setName('setup')
    .setDescription('Configure Linebreakers bot settings')
    .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
      sub
        .setName('channel')
        .setDescription('Set the timeline channel for a campaign')
        .addStringOption(opt =>
          opt
            .setName('campaign')
            .setDescription('Select campaign')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('Channel for timeline posts')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'channel') {
      const profile = await getLinkedProfile(interaction.user.id);
      if (!profile) {
        await interaction.reply({
          embeds: [errorEmbed('Not Linked', 'You need to link your Discord account first. Use `/link` with your Linebreakers username.')],
          ephemeral: true,
        });
        return;
      }

      const campaignId = interaction.options.getString('campaign', true);
      const channel = interaction.options.getChannel('channel', true);

      // Verify campaign exists
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('id, campaign_name')
        .eq('id', campaignId)
        .single();

      if (!campaign) {
        await interaction.reply({
          embeds: [errorEmbed('Campaign Not Found', 'Could not find that campaign.')],
          ephemeral: true,
        });
        return;
      }

      // Verify user is admin/owner/arbitrator of the campaign
      const { data: membership } = await supabase
        .from('campaign_members')
        .select('role')
        .eq('campaign_id', campaignId)
        .eq('user_id', profile.id)
        .single();

      if (!membership || !['ADMIN', 'OWNER', 'ARBITRATOR'].includes(membership.role)) {
        await interaction.reply({
          embeds: [errorEmbed('Permission Denied', 'You must be a campaign admin, owner, or arbitrator to configure the timeline channel.')],
          ephemeral: true,
        });
        return;
      }

      // Update campaign with Discord settings
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({
          discord_guild_id: interaction.guildId,
          discord_timeline_channel_id: channel.id,
        })
        .eq('id', campaignId);

      if (updateError) {
        console.error('Failed to update campaign:', updateError);
        await interaction.reply({
          embeds: [errorEmbed('Setup Failed', 'An error occurred while saving the channel configuration.')],
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        embeds: [successEmbed(
          'Timeline Channel Set!',
          `Campaign **${campaign.campaign_name}** will now post battle narratives to <#${channel.id}>.`
        )],
      });
    }
  },
};
