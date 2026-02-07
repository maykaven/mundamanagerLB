import { AutocompleteInteraction } from 'discord.js';
import { supabase } from './supabase.js';

/**
 * Handle autocomplete interactions for slash command options.
 * Queries Supabase to provide dynamic dropdown suggestions.
 */
export async function handleAutocomplete(interaction: AutocompleteInteraction) {
  const focusedOption = interaction.options.getFocused(true);
  const commandName = interaction.commandName;
  const subcommand = interaction.options.getSubcommand(false);

  try {
    switch (focusedOption.name) {
      case 'campaign':
        return await autocompleteCampaign(interaction, focusedOption.value);

      case 'winner':
      case 'loser': {
        const campaignId = interaction.options.getString('campaign');
        return await autocompleteGang(interaction, focusedOption.value, campaignId);
      }

      case 'battle':
        return await autocompleteBattle(interaction, focusedOption.value);

      default:
        return await interaction.respond([]);
    }
  } catch (error) {
    console.error(`Autocomplete error for ${focusedOption.name}:`, error);
    return await interaction.respond([]);
  }
}

/**
 * Autocomplete campaigns the user is a member of.
 */
async function autocompleteCampaign(interaction: AutocompleteInteraction, query: string) {
  // First get the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('discord_id', interaction.user.id)
    .single();

  if (!profile) {
    return await interaction.respond([
      { name: 'Link your account first with /link', value: 'none' }
    ]);
  }

  // Get campaigns the user is a member of
  const { data: memberships } = await supabase
    .from('campaign_members')
    .select('campaign_id')
    .eq('user_id', profile.id);

  if (!memberships || memberships.length === 0) {
    return await interaction.respond([
      { name: 'No campaigns found', value: 'none' }
    ]);
  }

  const campaignIds = memberships.map(m => m.campaign_id);

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, campaign_name, status')
    .in('id', campaignIds)
    .ilike('campaign_name', `%${query}%`)
    .limit(25);

  const choices = (campaigns || []).map(c => ({
    name: `${c.campaign_name} (${c.status || 'Active'})`,
    value: c.id,
  }));

  return await interaction.respond(choices);
}

/**
 * Autocomplete gangs in a campaign.
 */
async function autocompleteGang(interaction: AutocompleteInteraction, query: string, campaignId: string | null) {
  if (!campaignId) {
    return await interaction.respond([
      { name: 'Select a campaign first', value: 'none' }
    ]);
  }

  // Get gangs in this campaign via campaign_gangs join table
  const { data: campaignGangs } = await supabase
    .from('campaign_gangs')
    .select('gang_id')
    .eq('campaign_id', campaignId);

  if (!campaignGangs || campaignGangs.length === 0) {
    return await interaction.respond([
      { name: 'No gangs in this campaign', value: 'none' }
    ]);
  }

  const gangIds = campaignGangs.map(cg => cg.gang_id);

  const { data: gangs } = await supabase
    .from('gangs')
    .select('id, name, gang_type')
    .in('id', gangIds)
    .ilike('name', `%${query}%`)
    .limit(25);

  const choices = (gangs || []).map(g => ({
    name: `${g.name} (${g.gang_type || 'Unknown'})`,
    value: g.id,
  }));

  return await interaction.respond(choices);
}

/**
 * Autocomplete recent battles for confirmation.
 * Shows battles where the user's gang is a participant and that haven't been confirmed yet.
 */
async function autocompleteBattle(interaction: AutocompleteInteraction, query: string) {
  // Get the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('discord_id', interaction.user.id)
    .single();

  if (!profile) {
    return await interaction.respond([]);
  }

  // Get the user's gangs
  const { data: gangs } = await supabase
    .from('gangs')
    .select('id, name')
    .eq('user_id', profile.id);

  if (!gangs || gangs.length === 0) {
    return await interaction.respond([]);
  }

  const gangIds = gangs.map(g => g.id);

  // Get recent battles where user's gang is attacker or defender
  // and that don't have a "Confirmed by" note from this user
  const { data: battles } = await supabase
    .from('campaign_battles')
    .select('id, attacker_id, defender_id, winner_id, created_at, note, narrative')
    .or(`attacker_id.in.(${gangIds.join(',')}),defender_id.in.(${gangIds.join(',')})`)
    .order('created_at', { ascending: false })
    .limit(25);

  if (!battles || battles.length === 0) {
    return await interaction.respond([]);
  }

  // Get gang names for display
  const allGangIds = [...new Set(battles.flatMap(b => [b.attacker_id, b.defender_id].filter(Boolean)))];
  const { data: allGangs } = await supabase
    .from('gangs')
    .select('id, name')
    .in('id', allGangIds);

  const gangMap = new Map((allGangs || []).map(g => [g.id, g.name]));

  const choices = battles
    .filter(b => {
      // Filter out battles already confirmed by this user
      if (b.note && b.note.includes(`Confirmed by ${profile.id}`)) return false;
      return true;
    })
    .slice(0, 25)
    .map(b => {
      const attacker = gangMap.get(b.attacker_id) || 'Unknown';
      const defender = gangMap.get(b.defender_id) || 'Unknown';
      const date = new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      const outcome = b.winner_id ? `${attacker} vs ${defender}` : `${attacker} vs ${defender} (Draw)`;
      return {
        name: `${date}: ${outcome}`.slice(0, 100),
        value: b.id,
      };
    });

  return await interaction.respond(choices);
}
