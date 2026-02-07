-- Add discord_id to profiles (for linking Discord users to web accounts)
ALTER TABLE profiles ADD COLUMN discord_id text UNIQUE;

-- Add discord settings to campaigns
ALTER TABLE campaigns ADD COLUMN discord_guild_id text;
ALTER TABLE campaigns ADD COLUMN discord_timeline_channel_id text;

-- Add narrative to campaign_battles
ALTER TABLE campaign_battles ADD COLUMN narrative text;

-- Campaign narratives table for timeline events beyond battles
CREATE TABLE campaign_narratives (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  narrative_type text NOT NULL CHECK (narrative_type IN ('BATTLE','TERRITORY','EVENT','CAMPAIGN_START','CAMPAIGN_END')),
  narrative_text text NOT NULL,
  related_battle_id uuid REFERENCES campaign_battles(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_campaign_narratives_campaign_id ON campaign_narratives(campaign_id);
CREATE INDEX idx_campaign_narratives_type ON campaign_narratives(narrative_type);

-- RLS
ALTER TABLE campaign_narratives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaign members can view narratives" ON campaign_narratives
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaign_members cm
      WHERE cm.campaign_id = campaign_narratives.campaign_id
      AND cm.user_id = auth.uid()
    )
  );

-- Service role can insert narratives (bot uses service role key)
CREATE POLICY "Service role can insert narratives" ON campaign_narratives
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update narratives" ON campaign_narratives
  FOR UPDATE USING (true);
