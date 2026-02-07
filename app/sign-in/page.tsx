'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { MdAppShortcut } from "react-icons/md";
import { FaUsers, FaDiscord } from "react-icons/fa";
import AboutMundaManager from "@/components/munda-manager-info/about-munda-manager";
import WhatIsMundaManager from "@/components/munda-manager-info/what-is-munda-manager";

export default function SignIn() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number | undefined>(undefined);
  const [gangCount, setGangCount] = useState<number | undefined>(undefined);
  const [campaignCount, setCampaignCount] = useState<number | undefined>(undefined);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const nextParam = searchParams.get('next');
        const isSafe = nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//');
        router.push(isSafe ? nextParam! : '/');
      }
    }

    checkAuth();

    const error = searchParams.get('error');
    if (error) {
      setErrorMessage(error);
    }

    async function fetchStats() {
      try {
        const [userResponse, gangResponse, campaignResponse] = await Promise.all([
          fetch('/api/stats/user-count'),
          fetch('/api/stats/gang-count'),
          fetch('/api/stats/campaign-count')
        ]);

        if (userResponse.ok) {
          const data = await userResponse.json();
          setUserCount(data.count);
        }
        if (gangResponse.ok) {
          const data = await gangResponse.json();
          setGangCount(data.count);
        }
        if (campaignResponse.ok) {
          const data = await campaignResponse.json();
          setCampaignCount(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }

    fetchStats();
  }, [searchParams, router, supabase.auth]);

  async function handleDiscordLogin() {
    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container mx-auto max-w-4xl w-full p-4">
        <div className="flex flex-col w-full max-w-sm mx-auto text-white">
          <h1 className="text-2xl font-medium text-white mb-2">Sign In</h1>
          <p className="text-sm text-white mb-6">
            Sign in with your Discord account to get started.
          </p>

          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleDiscordLogin}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white font-medium rounded-md transition-colors"
          >
            <FaDiscord className="h-5 w-5" />
            {loading ? 'Redirecting to Discord...' : 'Continue with Discord'}
          </button>
        </div>
      </div>

      {/* Presentation of the app */}
      <div className="container mx-auto max-w-4xl w-full space-y-4 mt-6">
        <div className="bg-card rounded-lg mb-4 flex">
          <button
            onClick={() => setActiveTab(0)}
            className={`flex-1 py-4 text-center transition-colors ${
              activeTab === 0
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-muted-foreground'
            } flex items-center justify-center`}
          >
            <MdAppShortcut className="h-5 w-5" />
            <span className="ml-2 hidden sm:inline">What is Linebreakers?</span>
          </button>

          <button
            onClick={() => setActiveTab(1)}
            className={`flex-1 py-4 text-center transition-colors ${
              activeTab === 1
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-muted-foreground'
            } flex items-center justify-center`}
          >
            <FaUsers className="s-5" />
            <span className="ml-2 hidden sm:inline">About</span>
          </button>
        </div>

        <div className="bg-card shadow-md rounded-lg p-4">
          {activeTab === 0 && (
            <div>
              <h1 className="text-xl font-semibold mb-4">What is Linebreakers? And what can you do with it?</h1>
              <WhatIsMundaManager userCount={userCount} gangCount={gangCount} campaignCount={campaignCount} />
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <h1 className="text-xl font-semibold mb-4">About Linebreakers</h1>
              <AboutMundaManager />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
