// This page uses server components with ISR caching for optimal performance
// Server actions should trigger revalidation of this data using revalidatePath

import { createClient } from "@/utils/supabase/server";
import { CreateGangButton } from '@/components/create-gang-modal';
import { CreateCampaignButton } from '@/components/create-campaign';
import { getUserGangs } from '@/app/lib/get-user-gangs';
import { getUserCampaigns } from '@/app/lib/get-user-campaigns';
import HomeTabs from '@/components/home-tabs';
import { getAuthenticatedUser } from '@/utils/auth';
import { GrHelpBook } from "react-icons/gr";
import { PwaInstallButton } from '@/components/pwa-install-button';
import { getUserCustomEquipment } from "@/app/lib/customise/custom-equipment";
import { getUserCustomTerritories } from "@/app/lib/customise/custom-territories";
import { getUserCustomFighterTypes } from "@/app/lib/customise/custom-fighters";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();

  let user;
  try {
    user = await getAuthenticatedUser(supabase);
  } catch (error) {
    redirect("/sign-in");
  }

  // Single invocation that gets gangs, campaigns, and customise data
  const [
    gangs,
    campaigns,
    customEquipment,
    customTerritories,
    customFighterTypes
  ] = await Promise.all([
    getUserGangs(),
    getUserCampaigns(),
    getUserCustomEquipment(user.id),
    getUserCustomTerritories(),
    getUserCustomFighterTypes(user.id)
  ]);

  // Fetch campaign types and trading post types for the create campaign modal
  const [campaignTypesResult, tradingPostTypesResult] = await Promise.all([
    supabase
      .from('campaign_types')
      .select('id, campaign_type_name, trading_posts'),
    supabase
      .from('trading_post_types')
      .select('id, trading_post_name')
      .order('trading_post_name')
  ]);

  const campaignTypes = campaignTypesResult.data;
  const tradingPostTypes = tradingPostTypesResult.data;

  // Fetch user's campaigns for sharing (where user is owner or arbitrator)
  const { data: campaignMembers } = await supabase
    .from('campaign_members')
    .select('campaign_id')
    .eq('user_id', user.id)
    .in('role', ['OWNER', 'ARBITRATOR']);

  const campaignIds = campaignMembers?.map(cm => cm.campaign_id) || [];

  let userCampaigns: Array<{ id: string; campaign_name: string; status: string | null }> = [];
  if (campaignIds.length > 0) {
    const { data: campaignsForShare } = await supabase
      .from('campaigns')
      .select('id, campaign_name, status')
      .in('id', campaignIds)
      .order('campaign_name');

    userCampaigns = campaignsForShare || [];
  }

  if (campaignTypesResult.error) {
    console.error('Error fetching campaign types:', campaignTypesResult.error);
  }
  if (tradingPostTypesResult.error) {
    console.error('Error fetching trading post types:', tradingPostTypesResult.error);
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container ml-[10px] mr-[10px] max-w-4xl w-full space-y-4">
        <div className="bg-card shadow-md rounded-lg overflow-hidden">
          {/* Hero banner with background image */}
          <div className="relative h-40 md:h-48">
            <Image
              src="/images/hero-bg.png"
              alt="The Underhive"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-3">
              <Image
                src="/images/logo.png"
                alt="Linebreakers"
                width={56}
                height={56}
                className="rounded-lg border-2 border-primary shadow-lg"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Linebreakers</h1>
                <p className="text-sm text-muted-foreground">
                  Track your gangs, log battles, and watch your campaign unfold with AI-powered narratives.
                </p>
              </div>
            </div>
          </div>
          {/* Action bar */}
          <div className="p-4">
            <div className="flex gap-1 justify-center mb-4">
              <Link href="/user-guide" prefetch={false} className="flex justify-center items-center px-2 py-1 text-sm rounded-md hover:bg-muted w-full whitespace-nowrap">
                <GrHelpBook className="mr-1 size-4" />
                <span className="sm:hidden">Guide</span>
                <span className="hidden sm:inline">User Guide</span>
              </Link>
              <PwaInstallButton />
            </div>
            <div className="flex flex-wrap gap-1">
              <div className="flex-1 min-w-[135px] sm:w-auto w-full">
                <CreateGangButton />
              </div>
              <div className="flex-1 min-w-[135px] sm:w-auto w-full">
                <CreateCampaignButton initialCampaignTypes={campaignTypes} initialTradingPostTypes={tradingPostTypes} userId={user.id} />
              </div>
            </div>
          </div>
        </div>

        <HomeTabs
          gangs={gangs}
          campaigns={campaigns}
          userId={user.id}
          customEquipment={customEquipment}
          customTerritories={customTerritories}
          customFighterTypes={customFighterTypes}
          userCampaigns={userCampaigns}
        />
      </div>
    </main>
  )
}
