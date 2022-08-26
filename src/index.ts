import { dirname, importx } from '@discordx/importer';
import { IntentsBitField } from 'discord.js';
import { Client, DIService, tsyringeDependencyRegistryEngine } from 'discordx';
import { container } from 'tsyringe';

import 'dotenv/config';
import 'reflect-metadata';

const client = new Client({
	// To only use global commands (use @Guild for specific guild command), comment this line
	botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

	// Discord intents
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildVoiceStates,
		IntentsBitField.Flags.DirectMessages,
		IntentsBitField.Flags.MessageContent,
	],

	// Debug logs are disabled in silent mode
	silent: false,

	// Configuration for @SimpleCommand
	simpleCommand: {
		prefix: '.',
	},
});

async function run() {
	DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

	await importx(dirname(import.meta.url) + '/{events,commands,buttons}/**/*.{ts,js}');

	if (!process.env.BOT_TOKEN) {
		throw Error('BOT_TOKEN in not set in your environment');
	}

	await client.login(process.env.BOT_TOKEN);
}

await run();
