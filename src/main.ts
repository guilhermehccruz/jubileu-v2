import 'reflect-metadata';
import 'dotenv/config';
import './config/validateEnv.js';

import { dirname, importx } from '@discordx/importer';
import { IntentsBitField } from 'discord.js';
import { DIService, tsyringeDependencyRegistryEngine } from 'discordx';
import { container, instanceCachingFactory } from 'tsyringe';

import { Client } from './core/Client.js';

async function run() {
	DIService.engine = tsyringeDependencyRegistryEngine
		.setUseTokenization(true)
		.setCashingSingletonFactory(instanceCachingFactory)
		.setInjector(container);

	//* import the services first, as other classes depend on them
	await importx(`${dirname(import.meta.url)}/{services}/**/*.{ts,js}`);
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
