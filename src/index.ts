import 'dotenv/config';
import 'reflect-metadata';

import './config/validateEnv.js';

import { dirname, importx } from '@discordx/importer';
import { IntentsBitField } from 'discord.js';
import { Client, DIService, tsyringeDependencyRegistryEngine } from 'discordx';
import { container } from 'tsyringe';

async function run() {
	DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

	await importx(`${dirname(import.meta.url)}/{events,commands,buttons}/**/*.{ts,js}`);

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
		],

		// Debug logs are disabled in silent mode
		silent: false,
	});

	await client.login(process.env.BOT_TOKEN);
}

void run();
