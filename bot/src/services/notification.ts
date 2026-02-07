import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { supabase } from '../supabase.js';

let notificationService: NotificationService | null = null;

export class NotificationService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Send a DM to a user by their Supabase profile ID.
   * Looks up discord_id from the profiles table.
   */
  async sendDM(profileId: string, embed: EmbedBuilder): Promise<boolean> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('discord_id, username')
        .eq('id', profileId)
        .single();

      if (!profile?.discord_id) {
        console.log(`User ${profileId} has no discord_id linked`);
        return false;
      }

      const discordUser = await this.client.users.fetch(profile.discord_id);
      await discordUser.send({ embeds: [embed] });
      console.log(`Sent DM to ${profile.username} (${profile.discord_id})`);
      return true;
    } catch (error) {
      console.error(`Failed to send DM to user ${profileId}:`, error);
      return false;
    }
  }

  /**
   * Post an embed to a campaign's timeline channel.
   */
  async postToTimeline(campaignId: string, embed: EmbedBuilder): Promise<boolean> {
    try {
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('discord_timeline_channel_id, campaign_name')
        .eq('id', campaignId)
        .single();

      if (!campaign?.discord_timeline_channel_id) {
        console.log(`Campaign ${campaignId} has no timeline channel configured`);
        return false;
      }

      const channel = await this.client.channels.fetch(campaign.discord_timeline_channel_id);
      if (!channel || !(channel instanceof TextChannel)) {
        console.error(`Channel ${campaign.discord_timeline_channel_id} not found or not a text channel`);
        return false;
      }

      await channel.send({ embeds: [embed] });
      console.log(`Posted to timeline channel for campaign "${campaign.campaign_name}"`);
      return true;
    } catch (error) {
      console.error(`Failed to post to timeline for campaign ${campaignId}:`, error);
      return false;
    }
  }
}

export function initNotificationService(client: Client) {
  notificationService = new NotificationService(client);
}

export function getNotificationService(): NotificationService | null {
  return notificationService;
}
