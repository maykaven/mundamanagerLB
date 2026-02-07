import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { supabase } from '../supabase.js';
import { successEmbed, errorEmbed } from '../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your Discord account to your Linebreakers profile')
    .addStringOption(opt =>
      opt
        .setName('username')
        .setDescription('Your Linebreakers username')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const username = interaction.options.getString('username', true);
    const discordId = interaction.user.id;

    // Look up profile by username (case-insensitive)
    const { data: profile, error: lookupError } = await supabase
      .from('profiles')
      .select('id, username, discord_id')
      .ilike('username', username)
      .single();

    if (lookupError || !profile) {
      await interaction.reply({
        embeds: [errorEmbed('Profile Not Found', `No Linebreakers profile found with username "${username}". Check your spelling and try again.`)],
        ephemeral: true,
      });
      return;
    }

    // Already linked to this Discord user
    if (profile.discord_id === discordId) {
      await interaction.reply({
        embeds: [successEmbed('Already Linked', `Your Discord account is already linked to **${profile.username}**.`)],
        ephemeral: true,
      });
      return;
    }

    // Linked to a different Discord user
    if (profile.discord_id && profile.discord_id !== discordId) {
      await interaction.reply({
        embeds: [errorEmbed('Already Linked', `This profile is already linked to a different Discord account.`)],
        ephemeral: true,
      });
      return;
    }

    // Check if this Discord ID is already linked to another profile
    const { data: existingLink } = await supabase
      .from('profiles')
      .select('username')
      .eq('discord_id', discordId)
      .single();

    if (existingLink) {
      await interaction.reply({
        embeds: [errorEmbed('Discord Already Linked', `Your Discord account is already linked to profile **${existingLink.username}**. Unlink that first.`)],
        ephemeral: true,
      });
      return;
    }

    // Link the accounts
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ discord_id: discordId })
      .eq('id', profile.id);

    if (updateError) {
      console.error('Failed to link profile:', updateError);
      await interaction.reply({
        embeds: [errorEmbed('Link Failed', 'An error occurred while linking your account. Please try again.')],
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      embeds: [successEmbed('Account Linked!', `Your Discord account has been linked to **${profile.username}**. You can now use battle and timeline commands.`)],
      ephemeral: true,
    });
  },
};
