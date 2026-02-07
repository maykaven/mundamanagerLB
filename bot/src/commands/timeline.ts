import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { supabase } from '../supabase.js';
import { timelineEmbed, errorEmbed, TimelineEntry } from '../embeds/index.js';

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
    .setName('timeline')
    .setDescription('View campaign timeline')
    .addStringOption(opt =>
      opt
        .setName('campaign')
        .setDescription('Select campaign')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addIntegerOption(opt =>
      opt
        .setName('count')
        .setDescription('Number of events to show (1-10)')
        .setMinValue(1)
        .setMaxValue(10)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const profile = await getLinkedProfile(interaction.user.id);
    if (!profile) {
      await interaction.reply({
        embeds: [errorEmbed('Not Linked', 'Link your Discord account first with `/link`.')],
        ephemeral: true,
      });
      return;
    }

    const campaignId = interaction.options.getString('campaign', true);
    const count = interaction.options.getInteger('count') || 5;

    // Verify campaign exists
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id, campaign_name')
      .eq('id', campaignId)
      .single();

    if (!campaign) {
      await interaction.reply({
        embeds: [errorEmbed('Campaign Not Found')],
        ephemeral: true,
      });
      return;
    }

    // Fetch recent narratives
    const { data: narratives, error } = await supabase
      .from('campaign_narratives')
      .select('narrative_type, narrative_text, created_at')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
      .limit(count);

    if (error) {
      console.error('Failed to fetch narratives:', error);
      await interaction.reply({
        embeds: [errorEmbed('Failed to fetch timeline')],
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      embeds: [timelineEmbed((narratives || []) as TimelineEntry[], campaign.campaign_name)],
    });
  },
};
