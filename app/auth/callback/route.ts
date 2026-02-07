import { createClient, createServiceRoleClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function safePath(p?: string) {
  if (!p) return "/";
  if (!p.startsWith("/") || p.startsWith("//")) return "/";
  return p;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Auto-create profile for new Discord users
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const serviceClient = createServiceRoleClient();

          // Check if profile already exists
          const { data: existingProfile } = await serviceClient
            .from('profiles')
            .select('id, discord_id')
            .eq('id', user.id)
            .single();

          if (!existingProfile) {
            // New user — create profile from Discord metadata
            const metadata = user.user_metadata || {};
            let username = metadata.full_name || metadata.name || metadata.custom_claims?.global_name || 'User';
            const discordId = metadata.provider_id || null;

            // Try to insert, handle username conflicts by appending random suffix
            let inserted = false;
            let attempts = 0;
            while (!inserted && attempts < 5) {
              const tryUsername = attempts === 0 ? username : `${username}_${Math.random().toString(36).slice(2, 6)}`;
              const { error: insertError } = await serviceClient
                .from('profiles')
                .insert({
                  id: user.id,
                  username: tryUsername,
                  discord_id: discordId,
                  user_role: 'user',
                });

              if (!insertError) {
                inserted = true;
              } else if (insertError.code === '23505') {
                attempts++;
              } else {
                console.error('Profile creation error:', insertError);
                break;
              }
            }
          } else if (!existingProfile.discord_id) {
            // Existing user missing discord_id — backfill it
            const metadata = user.user_metadata || {};
            const discordId = metadata.provider_id || null;
            if (discordId) {
              await serviceClient
                .from('profiles')
                .update({ discord_id: discordId })
                .eq('id', user.id);
            }
          }
        }
      } catch (err) {
        // Non-blocking: profile creation failure shouldn't block login
        console.error('Error during profile auto-creation:', err);
      }
    }
  }

  const cookieStore = await cookies();
  const redirectCookie = cookieStore.get('redirectPath');
  if (redirectCookie?.value) {
    cookieStore.delete('redirectPath');
    const destination = safePath(redirectCookie.value);
    return NextResponse.redirect(`${origin}${destination}`);
  }

  return NextResponse.redirect(origin);
}
