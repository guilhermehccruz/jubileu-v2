import { QueueManager } from '@discordx/lava-queue';
import { EmbedBuilder } from 'discord.js';
import type { TextChannel } from 'discord.js';
import { Discord, Once } from 'discordx';
import type { Client } from 'discordx';
import { setTimeout } from 'node:timers/promises';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../utils/music/MusicPlayer.js';
import { getLavaNode } from '../utils/music/node.js';

@Discord()
@injectable()
export class Ready {
	@Once({ event: 'ready' })
	async ready([client]: [Client]): Promise<void> {
		// Make sure all guilds are cached
		await client.guilds.fetch();

		// Synchronize applications commands with Discord
		await client.initApplicationCommands();

		await Promise.all([
			this.sendReadyMessage(client),
			this.sendServersMessage(client),
			this.disconnectVoiceChannels(client),
		]);

		// Instantiate music player
		await setTimeout(5_000);
		musicPlayer.queueManager = new QueueManager(getLavaNode(client));

		console.log('>> Bot started');
	}

	private async sendReadyMessage(client: Client) {
		// Send ready message
		const readyChannel = client.channels.cache.get(process.env.READY_CHANNEL_ID) as TextChannel;

		await readyChannel.send({
			embeds: [
				new EmbedBuilder()
					.setTitle('Pai ta on')
					.setDescription(
						new Date().toLocaleString('pt-br').split(' ').reverse().join(' - ').replace(',', ''),
					),
			],
		});
	}

	private async sendServersMessage(client: Client) {
		// Send servers message
		const serversChannel = client.channels.cache.get(process.env.SERVERS_CHANNEL_ID) as TextChannel;

		await serversChannel.send({
			embeds: [
				new EmbedBuilder()
					.setTitle('Lista de servidores na hora que ligou')
					.setDescription(client.guilds.cache.map((server) => server.name).join('\n')),
			],
		});
	}

	private async disconnectVoiceChannels(client: Client) {
		for (const guild of client.guilds.cache) {
			await guild[1].members.me?.voice.disconnect();
		}
	}
}
