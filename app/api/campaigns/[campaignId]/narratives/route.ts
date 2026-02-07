import { createClient, createServiceRoleClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { generateBattleNarrative } from "@/utils/narrative";

export async function GET(request: Request, props: { params: Promise<{ campaignId: string }> }) {
  const params = await props.params;
  const { campaignId } = params;

  if (!campaignId) {
    return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('campaign_narratives')
      .select('id, campaign_id, narrative_type, narrative_text, related_battle_id, metadata, created_at')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching narratives:', error);
    return NextResponse.json({ error: "Failed to fetch narratives" }, { status: 500 });
  }
}

export async function POST(request: Request, props: { params: Promise<{ campaignId: string }> }) {
  const params = await props.params;
  const { campaignId } = params;

  if (!campaignId) {
    return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, battleId } = body;

    if (type === 'BATTLE' && battleId) {
      // Fetch the battle record
      const { data: battle, error: battleError } = await supabase
        .from('campaign_battles')
        .select('id, campaign_id, attacker_id, defender_id, winner_id, scenario, territory_id, note')
        .eq('id', battleId)
        .eq('campaign_id', campaignId)
        .single();

      if (battleError || !battle) {
        return NextResponse.json({ error: "Battle not found" }, { status: 404 });
      }

      // Fetch gang names and types
      const gangIds = [battle.attacker_id, battle.defender_id].filter(Boolean);
      const { data: gangs } = await supabase
        .from('gangs')
        .select('id, name, gang_type')
        .in('id', gangIds);

      const gangMap = new Map(gangs?.map((g: any) => [g.id, g]) || []);
      const attackerGang = gangMap.get(battle.attacker_id);
      const defenderGang = gangMap.get(battle.defender_id);

      const winnerGang = battle.winner_id ? gangMap.get(battle.winner_id) : attackerGang;
      const loserGang = battle.winner_id === battle.attacker_id ? defenderGang : attackerGang;

      const context = {
        winnerGang: winnerGang?.name || 'Unknown',
        winnerHouse: winnerGang?.gang_type || 'Unknown',
        loserGang: loserGang?.name || 'Unknown',
        loserHouse: loserGang?.gang_type || 'Unknown',
        scenario: battle.scenario || undefined,
        isDraw: battle.winner_id === null,
      };

      const narrativeText = await generateBattleNarrative(context);

      // Write using service role (bypasses RLS)
      const serviceClient = createServiceRoleClient();

      await Promise.all([
        serviceClient
          .from('campaign_battles')
          .update({ narrative: narrativeText })
          .eq('id', battle.id),
        serviceClient
          .from('campaign_narratives')
          .insert({
            campaign_id: campaignId,
            narrative_type: 'BATTLE',
            narrative_text: narrativeText,
            related_battle_id: battle.id,
            metadata: {
              scenario: battle.scenario,
              winner: winnerGang?.name || null,
              attacker: attackerGang?.name || null,
              defender: defenderGang?.name || null,
              isDraw: battle.winner_id === null,
            },
          }),
      ]);

      return NextResponse.json({ narrative: narrativeText });
    }

    return NextResponse.json({ error: "Invalid request. Provide type and battleId." }, { status: 400 });
  } catch (error) {
    console.error('Error generating narrative:', error);
    return NextResponse.json({ error: "Failed to generate narrative" }, { status: 500 });
  }
}
