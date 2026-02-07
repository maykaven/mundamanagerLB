import { REST, Routes, SlashCommandBuilder, SlashCommandSubcommandBuilder, ChannelType } from 'discord.js';
import { config } from './config.js';

const commands = [
  // /link - Link Discord to Linebreakers profile
  new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your Discord account to your Linebreakers profile')
    .addStringOption(opt =>
      opt
        .setName('username')
        .setDescription('Your Linebreakers username')
        .setRequired(true)
    ),

  // /setup - Bot configuration
  new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configure Linebreakers bot settings')
    .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
      sub
        .setName('channel')
        .setDescription('Set the timeline channel for a campaign')
        .addStringOption(opt =>
          opt
            .setName('campaign')
            .setDescription('Select campaign')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('Channel for timeline posts')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    ),

  // /battle - Report and confirm battles
  new SlashCommandBuilder()
    .setName('battle')
    .setDescription('Report and confirm battles')
    .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
      sub
        .setName('report')
        .setDescription('Report a battle result')
        .addStringOption(opt =>
          opt.setName('campaign').setDescription('Select campaign').setRequired(true).setAutocomplete(true)
        )
        .addStringOption(opt =>
          opt.setName('winner').setDescription('Winning gang').setRequired(true).setAutocomplete(true)
        )
        .addStringOption(opt =>
          opt.setName('loser').setDescription('Losing gang').setRequired(true).setAutocomplete(true)
        )
        .addStringOption(opt =>
          opt.setName('scenario').setDescription('Battle scenario (optional)')
        )
        .addStringOption(opt =>
          opt.setName('location').setDescription('Battle location (optional)')
        )
        .addBooleanOption(opt =>
          opt.setName('draw').setDescription('Was it a draw? (ignores winner/loser distinction)')
        )
    )
    .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
      sub
        .setName('confirm')
        .setDescription('Confirm or dispute a reported battle')
        .addStringOption(opt =>
          opt.setName('battle').setDescription('Select battle to confirm').setRequired(true).setAutocomplete(true)
        )
        .addBooleanOption(opt =>
          opt.setName('dispute').setDescription('Dispute this battle result?')
        )
        .addStringOption(opt =>
          opt.setName('notes').setDescription('Notes (especially if disputing)')
        )
    ),

  // /timeline - View campaign timeline
  new SlashCommandBuilder()
    .setName('timeline')
    .setDescription('View campaign timeline')
    .addStringOption(opt =>
      opt
        .setName('campaign')
        .setDescription('Select campaign')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addIntegerOption(opt =>
      opt
        .setName('count')
        .setDescription('Number of events to show (1-10)')
        .setMinValue(1)
        .setMaxValue(10)
    ),
];

const rest = new REST().setToken(config.DISCORD_BOT_TOKEN);

async function deployCommands() {
  try {
    console.log(`Deploying ${commands.length} slash commands...`);

    if (config.DISCORD_GUILD_ID) {
      // Guild-specific deployment (instant update)
      console.log(`Deploying to guild ${config.DISCORD_GUILD_ID} (instant update)...`);
      await rest.put(
        Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, config.DISCORD_GUILD_ID),
        { body: commands.map(c => c.toJSON()) }
      );
      console.log('Successfully deployed commands to guild!');
    } else {
      // Global deployment (can take up to 1 hour to propagate)
      console.log('Deploying globally (may take up to 1 hour to propagate)...');
      await rest.put(
        Routes.applicationCommands(config.DISCORD_CLIENT_ID),
        { body: commands.map(c => c.toJSON()) }
      );
      console.log('Successfully deployed commands globally!');
      console.log('TIP: Add DISCORD_GUILD_ID to .env for instant updates during development.');
    }
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
}

deployCommands();
