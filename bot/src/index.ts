import { Client, GatewayIntentBits, Events, Collection, Partials } from 'discord.js';
import { config } from './config.js';
import { errorEmbed } from './embeds/index.js';
import { initNotificationService } from './services/notification.js';

// Import commands
import linkCommand from './commands/link.js';
import setupCommand from './commands/setup.js';
import battleCommand from './commands/battle.js';
import timelineCommand from './commands/timeline.js';

// Import autocomplete handler
import { handleAutocomplete } from './autocomplete.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

// Command collection
const commands = new Collection<string, any>();
commands.set('link', linkCommand);
commands.set('setup', setupCommand);
commands.set('battle', battleCommand);
commands.set('timeline', timelineCommand);

// Ready event
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Linebreakers Bot ready! Logged in as ${readyClient.user.tag}`);
  initNotificationService(client);
});

// Interaction handler
client.on(Events.InteractionCreate, async (interaction) => {
  // Handle autocomplete
  if (interaction.isAutocomplete()) {
    await handleAutocomplete(interaction);
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);

    const errorMsg = {
      embeds: [errorEmbed('Command Error', 'An error occurred while executing this command.')],
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMsg);
    } else {
      await interaction.reply(errorMsg);
    }
  }
});

// Start bot
async function main() {
  try {
    console.log('Starting Linebreakers Bot...');
    await client.login(config.DISCORD_BOT_TOKEN);
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
}

main();
