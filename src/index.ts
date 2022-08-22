import { importx } from '@discordx/importer';
import { IntentsBitField } from 'discord.js';
import { Client } from 'discordx';

import 'dotenv/config';
import 'reflect-metadata';

const bot = new Client({
	// To only use global commands (use @Guild for specific guild command), comment this line
	botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

	// Discord intents
	intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMembers],

	// Debug logs are disabled in silent mode
	silent: false,

	// Configuration for @SimpleCommand
	simpleCommand: {
		prefix: '.',
	},
});

bot.once('ready', async () => {
	// Make sure all guilds are cached
	await bot.guilds.fetch();

	// Synchronize applications commands with Discord
	await bot.initApplicationCommands();

	console.log('>> Bot started');
});

async function run() {
	await importx('./{events,commands}/**/*.{ts,js}');

	// Let's start the bot
	if (!process.env.BOT_TOKEN) {
		throw Error('Could not find BOT_TOKEN in your environment');
	}

	// Log in with your bot token
	await bot.login(process.env.BOT_TOKEN);
}

await run();
