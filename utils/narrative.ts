import Anthropic from '@anthropic-ai/sdk';

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are a grimdark narrator for Necromunda, a tabletop wargame set in the Warhammer 40,000 universe.
The setting is the Underhive - a lawless, violent place beneath massive hive cities where gangs fight for territory, resources, and survival.

Your writing style should be:
- Dark and gritty, with gothic undertones
- Evocative and atmospheric
- Brief but impactful (2-4 sentences max)
- Use vivid, visceral language
- Reference the industrial, decaying environment
- Never break character or reference game mechanics

Do not use quotation marks around your response. Write directly in narrative prose.`;

export interface BattleContext {
  winnerGang: string;
  winnerHouse: string;
  loserGang: string;
  loserHouse: string;
  location?: string;
  scenario?: string;
  isDraw?: boolean;
}

interface TerritoryContext {
  gangName: string;
  gangHouse: string;
  territoryName: string;
  previousController?: string;
}

async function generateNarrative(prompt: string, fallback: string): Promise<string> {
  if (!client) {
    console.log('No Anthropic API key configured, using fallback narrative');
    return fallback;
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    return textContent && 'text' in textContent ? textContent.text : fallback;
  } catch (error) {
    console.error('Failed to generate narrative:', error);
    return fallback;
  }
}

export async function generateBattleNarrative(context: BattleContext): Promise<string> {
  if (context.isDraw) {
    const fallback = `Blood was spilled at ${context.location || 'the underhive'}. Neither ${context.winnerGang} nor ${context.loserGang} could claim victory. The echoes of gunfire fade, but the rivalries endure.`;
    const prompt = `Write a brief battle summary (2-3 sentences) for this Necromunda skirmish that ended in a draw:
- Gang 1: ${context.winnerGang} (${context.winnerHouse})
- Gang 2: ${context.loserGang} (${context.loserHouse})
- Location: ${context.location || 'somewhere in the underhive'}
${context.scenario ? `- Scenario: ${context.scenario}` : ''}
The battle was a draw - neither side emerged victorious.`;
    return generateNarrative(prompt, fallback);
  }

  const fallback = `Blood was spilled at ${context.location || 'the underhive'}. ${context.winnerGang} emerged victorious over ${context.loserGang}. The echoes of gunfire fade, but the rivalries endure.`;

  const prompt = `Write a brief battle summary (2-3 sentences) for this Necromunda skirmish:
- Winner: ${context.winnerGang} (${context.winnerHouse})
- Loser: ${context.loserGang} (${context.loserHouse})
- Location: ${context.location || 'somewhere in the underhive'}
${context.scenario ? `- Scenario: ${context.scenario}` : ''}`;

  return generateNarrative(prompt, fallback);
}

export async function generateTerritoryNarrative(context: TerritoryContext): Promise<string> {
  const fallback = context.previousController
    ? `${context.gangName} has wrested control of ${context.territoryName} from ${context.previousController}. The balance of power shifts in the underhive.`
    : `${context.gangName} has claimed ${context.territoryName}, extending their reach in the hive.`;

  const prompt = context.previousController
    ? `Write a brief territory capture description (2-3 sentences) for Necromunda:
- Conquering gang: ${context.gangName} (${context.gangHouse})
- Territory: ${context.territoryName}
- Previous controller: ${context.previousController}`
    : `Write a brief territory claim description (2-3 sentences) for Necromunda:
- Gang: ${context.gangName} (${context.gangHouse})
- Territory: ${context.territoryName}
- This territory was previously unclaimed`;

  return generateNarrative(prompt, fallback);
}

export async function generateCampaignStartNarrative(campaignName: string): Promise<string> {
  const fallback = `The campaign begins! Gangs across the underhive sharpen their blades and load their weapons. Blood will flow.`;

  const prompt = `Write a brief campaign start announcement (2-3 sentences) for Necromunda:
- Campaign: ${campaignName}
Describe the beginning of warfare in the underhive.`;

  return generateNarrative(prompt, fallback);
}

export async function generateCampaignEndNarrative(campaignName: string): Promise<string> {
  const fallback = `The campaign has concluded. Winners and losers alike lick their wounds, knowing the underhive's wars are never truly over.`;

  const prompt = `Write a brief campaign conclusion (2-3 sentences) for Necromunda:
- Campaign: ${campaignName}
Describe the end of this chapter of warfare, but hint that peace never lasts in the underhive.`;

  return generateNarrative(prompt, fallback);
}
