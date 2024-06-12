import { Player } from '@discordx/lava-queue';
import { EmbedBuilder } from 'discord.js';
import { Discord, Once } from 'discordx';
import type { Client } from 'discordx';
import { setTimeout } from 'node:timers/promises';
import { setIntervalAsync } from 'set-interval-async';
import { container, injectable } from 'tsyringe';

import { MusicPlayer } from '@/utils/music/MusicPlayer.js';
import { getLavaNode } from '@/utils/music/node.js';

@Discord()
@injectable()
export class Ready {
	@Once({ event: 'ready' })
	async ready([client]: [Client]): Promise<void> {
		// Make sure all guilds are cached
		await client.guilds.fetch();

		// Synchronize applications commands with Discord
		await client.initApplicationCommands();

		await this.sendReadyMessage(client);

		await this.sendServersMessage(client);

		this.sendConnectedToMessage(client);

		// Instantiate music player
		await setTimeout(5e3);
		const musicPlayer = container.resolve(MusicPlayer);
		musicPlayer.player[client.botId] = new Player(getLavaNode(client));

		console.log('>> Bot started');
	}

	private async sendReadyMessage(client: Client) {
		// Send ready message
		const readyChannel = client.channels.cache.get(process.env.READY_CHANNEL_ID);

		const readyAtDate = new Date().toLocaleString('pt-br').split(' ').reverse().join(' - ').replace(',', '');

		const readyEmbed = new EmbedBuilder().setTitle('Pai ta on').setDescription(readyAtDate);

		if (readyChannel?.isTextBased()) {
			await readyChannel.send({ embeds: [readyEmbed] });
		}
	}

	private async sendServersMessage(client: Client) {
		// Send servers message
		const serversChannel = client.channels.cache.get(process.env.SERVERS_CHANNEL_ID);

		const serversEmbed = new EmbedBuilder()
			.setTitle('Lista de servidores na hora que ligou')
			.setDescription(client.guilds.cache.map((server) => server.name).join('\n'));

		if (serversChannel?.isTextBased()) {
			await serversChannel.send({ embeds: [serversEmbed] });
		}
	}

	private sendConnectedToMessage(client: Client) {
		setIntervalAsync(async () => {
			// Servers the bot is connected to a voice channel
			const connectedToChannel = await client.channels.fetch(process.env.SERVERS_CONNECTED_CHANNEL_ID);
			if (connectedToChannel?.isTextBased()) {
				const servers: string[] = [];

				for await (const guild of client.guilds.cache) {
					if (guild[1].members.me?.voice.channelId) {
						servers.push(`${guild[1].name}\n`);
					}
				}

				if (connectedToChannel.lastMessageId) {
					const message = await connectedToChannel.messages
						.fetch(connectedToChannel.lastMessageId)
						.catch(() => {
							return;
						});

					// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
					if (message && message.deletable) {
						await message.delete().catch(() => {
							return;
						});
					}
				}

				const serversEmbed = new EmbedBuilder().setTitle(
					'Servidores que estou atualmente conectado a um canal de voz',
				);

				if (servers.length) {
					serversEmbed.setDescription(servers.join('\n'));

					await connectedToChannel.send({ embeds: [serversEmbed] });
				} else {
					serversEmbed.setDescription('Nenhum');

					await connectedToChannel.send({ embeds: [serversEmbed] });
				}
			}
		}, 30000);
	}
}
