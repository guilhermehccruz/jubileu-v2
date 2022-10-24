import { Player } from '@discordx/lava-queue';
import { EmbedBuilder } from 'discord.js';
import { Discord, Once } from 'discordx';
import type { Client } from 'discordx';
import { setIntervalAsync } from 'set-interval-async';
import { container, injectable } from 'tsyringe';

import { getLavaNode } from '../utils/music/getLavaNode.js';
import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class Ready {
	@Once({ event: 'ready' })
	async ready([client]: [Client]): Promise<void> {
		// Make sure all guilds are cached
		await client.guilds.fetch();

		// Synchronize applications commands with Discord
		await client.initApplicationCommands();

		// Send ready message
		if (process.env.READY_CHANNEL_ID) {
			const readyChannel = client.channels.cache.get(process.env.READY_CHANNEL_ID);

			const readyAtDate =
				client.readyAt?.toLocaleString('pt-BR').split(' ').reverse().join(' - ') ??
				new Date().toLocaleString('pt-BR').split(' ').reverse().join(' - ');

			const readyEmbed = new EmbedBuilder().setTitle('Pai ta on').setDescription(readyAtDate);

			if (readyChannel?.isTextBased()) {
				await readyChannel.send({ embeds: [readyEmbed] });
			}
		}

		// Send servers message
		if (process.env.SERVERS_CHANNEL_ID) {
			const serversChannel = client.channels.cache.get(process.env.SERVERS_CHANNEL_ID);

			const serversEmbed = new EmbedBuilder()
				.setTitle('Lista de servidores na hora que ligou')
				.setDescription(client.guilds.cache.map((server) => server.name).join('\n'));

			if (serversChannel?.isTextBased()) {
				await serversChannel.send({ embeds: [serversEmbed] });
			}
		}

		// Instantiate music player
		const musicPlayer = container.resolve(MusicPlayer);
		musicPlayer.player[client.botId] = new Player(getLavaNode(client));

		// Servers the bot is connected to a voice channel
		if (process.env.SERVERS_CONNECTED_CHANNEL_ID) {
			const connectedToChannel = client.channels.cache.get(process.env.SERVERS_CONNECTED_CHANNEL_ID);

			if (connectedToChannel?.isTextBased()) {
				setIntervalAsync(async () => {
					const servers: string[] = [];

					for await (const guild of client.guilds.cache) {
						if (guild[1].members.me?.voice.sessionId) {
							servers.push(`${guild[1].name}\n`);
						}
					}

					if (connectedToChannel.lastMessageId) {
						const message = await connectedToChannel.messages
							.fetch(connectedToChannel.lastMessageId)
							.catch(() => console.log('Não deu pra achar a mensagem'));

						// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
						if (message && message.deletable) {
							await message.delete().catch(() => console.log('Não deu pra apagar a mensagem'));
						}
					}
					const serversEmbed = new EmbedBuilder().setTitle(
						'Servidores que estou atualmente conectado a um canal de voz'
					);

					if (servers.length) {
						serversEmbed.setDescription(servers.join('\n'));

						await connectedToChannel.send({ embeds: [serversEmbed] });
					} else {
						serversEmbed.setDescription('Nenhum');

						await connectedToChannel.send({ embeds: [serversEmbed] });
					}
				}, 30000);
			}
		}

		console.log('>> Bot started');
	}
}
