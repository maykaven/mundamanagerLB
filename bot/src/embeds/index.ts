import { EmbedBuilder, ColorResolvable } from 'discord.js';

const COLORS = {
  primary: 0x8b0000 as ColorResolvable,  // Dark red - Linebreakers
  success: 0x228b22 as ColorResolvable,  // Forest green
  warning: 0xffa500 as ColorResolvable,  // Orange
  error: 0xff0000 as ColorResolvable,    // Red
  info: 0x4169e1 as ColorResolvable,     // Royal blue
};

export function successEmbed(title: string, description?: string) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(COLORS.success)
    .setTimestamp();
  if (description) embed.setDescription(description);
  return embed;
}

export function errorEmbed(title: string, description?: string) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(COLORS.error)
    .setTimestamp();
  if (description) embed.setDescription(description);
  return embed;
}

export function warningEmbed(title: string, description?: string) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(COLORS.warning)
    .setTimestamp();
  if (description) embed.setDescription(description);
  return embed;
}

export interface BattleEmbedData {
  id: string;
  campaignName: string;
  winnerName: string;
  loserName: string;
  winnerHouse: string;
  loserHouse: string;
  scenario?: string | null;
  location?: string | null;
  narrative?: string | null;
  isDraw?: boolean;
}

export function battleEmbed(data: BattleEmbedData) {
  const outcomeText = data.isDraw
    ? `**${data.winnerName}** vs **${data.loserName}** — Draw`
    : `**${data.winnerName}** defeated **${data.loserName}**`;

  const embed = new EmbedBuilder()
    .setTitle(`Battle Report`)
    .setColor(COLORS.primary)
    .setDescription(outcomeText)
    .addFields(
      { name: 'Campaign', value: data.campaignName, inline: true },
    )
    .setTimestamp();

  if (data.scenario) {
    embed.addFields({ name: 'Scenario', value: data.scenario, inline: true });
  }
  if (data.location) {
    embed.addFields({ name: 'Location', value: data.location, inline: true });
  }

  if (data.narrative) {
    embed.addFields({ name: 'Narrative', value: data.narrative });
  }

  embed.setFooter({ text: `Battle ID: ${data.id.slice(0, 8)}` });

  return embed;
}

export interface TimelineEntry {
  narrative_type: string;
  narrative_text: string;
  created_at: string;
}

export function timelineEmbed(entries: TimelineEntry[], campaignName: string) {
  const embed = new EmbedBuilder()
    .setTitle(`Timeline: ${campaignName}`)
    .setColor(COLORS.primary)
    .setTimestamp();

  if (entries.length === 0) {
    embed.setDescription('No events recorded yet. Report a battle to get started!');
    return embed;
  }

  for (const entry of entries) {
    const date = new Date(entry.created_at).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const typeLabel = entry.narrative_type.charAt(0) + entry.narrative_type.slice(1).toLowerCase();
    embed.addFields({
      name: `${typeLabel} — ${date}`,
      value: entry.narrative_text.slice(0, 1024),
    });
  }

  return embed;
}
