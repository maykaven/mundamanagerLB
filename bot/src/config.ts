import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  DISCORD_BOT_TOKEN: requireEnv('DISCORD_BOT_TOKEN'),
  DISCORD_CLIENT_ID: requireEnv('DISCORD_CLIENT_ID'),
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID || null,
  SUPABASE_URL: requireEnv('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || null,
};
