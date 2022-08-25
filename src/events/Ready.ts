// import { EmbedBuilder } from 'discord.js';
// import { Discord, Once } from 'discordx';
// import type { Client } from 'discordx';

// @Discord()
// export class Ready {
// 	@Once({ event: 'ready' })
// 	async ready([client]: [Client]): Promise<void> {
// 		// Make sure all guilds are cached
// 		await client.guilds.fetch();

// 		// Synchronize applications commands with Discord
// 		await client.initApplicationCommands();

// 		const readyChannel = client.channels.cache.get(process.env.READY_CHANNEL_ID);

// 		const readyAtDate = client.readyAt!.toLocaleString('pt-BR').split(' ').reverse().join(' - ');

// 		const readyEmbed = new EmbedBuilder().setTitle('Pai ta on').setDescription(readyAtDate);

// 		if (readyChannel!.isTextBased()) {
// 			await readyChannel.send({ embeds: [readyEmbed] });
// 		}

// 		const serversChannel = client.channels.cache.get(process.env.SERVERS_CHANNEL_ID);

// 		const serversEmbed = new EmbedBuilder()
// 			.setTitle('Lista de servidores na hora que ligou')
// 			.setDescription(client.guilds.cache.map((server) => server.name).join('\n'));

// 		if (serversChannel!.isTextBased()) {
// 			await serversChannel.send({ embeds: [serversEmbed] });
// 		}

// 		console.log('>> Bot started');
// 	}
// }
