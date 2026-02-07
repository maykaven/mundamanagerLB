"use client"

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface NarrativeEntry {
  id: string;
  campaign_id: string;
  narrative_type: string;
  narrative_text: string;
  related_battle_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

interface CampaignTimelineProps {
  campaignId: string;
}

const TYPE_STYLES: Record<string, { label: string; className: string }> = {
  BATTLE: { label: "Battle", className: "bg-red-900/50 text-red-300 border-red-800" },
  TERRITORY: { label: "Territory", className: "bg-green-900/50 text-green-300 border-green-800" },
  EVENT: { label: "Event", className: "bg-blue-900/50 text-blue-300 border-blue-800" },
  CAMPAIGN_START: { label: "Campaign Start", className: "bg-amber-900/50 text-amber-300 border-amber-800" },
  CAMPAIGN_END: { label: "Campaign End", className: "bg-purple-900/50 text-purple-300 border-purple-800" },
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function CampaignTimeline({ campaignId }: CampaignTimelineProps) {
  const [narratives, setNarratives] = useState<NarrativeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNarratives() {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}/narratives`);
        if (!res.ok) throw new Error("Failed to load timeline");
        const data = await res.json();
        setNarratives(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load timeline");
      } finally {
        setLoading(false);
      }
    }
    fetchNarratives();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive py-4">{error}</p>;
  }

  if (narratives.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">
          No timeline events yet. Battles logged from Discord or the web app will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {narratives.map((entry) => {
        const style = TYPE_STYLES[entry.narrative_type] || TYPE_STYLES.EVENT;
        return (
          <div key={entry.id} className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className={`text-xs ${style.className}`}>
                {style.label}
              </Badge>
              <span className="text-xs text-muted-foreground">{formatDate(entry.created_at)}</span>
            </div>
            <p className="text-sm italic text-foreground/80 leading-relaxed">
              {entry.narrative_text}
            </p>
            {entry.metadata && (entry.metadata.winner || entry.metadata.attacker) && (
              <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                {entry.metadata.attacker && <span>{entry.metadata.attacker}</span>}
                {entry.metadata.attacker && entry.metadata.defender && <span>vs</span>}
                {entry.metadata.defender && <span>{entry.metadata.defender}</span>}
                {entry.metadata.scenario && <span className="ml-auto">{entry.metadata.scenario}</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
