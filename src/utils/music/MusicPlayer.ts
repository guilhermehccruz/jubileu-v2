import { QueueManager } from '@discordx/lava-queue';
import type { ButtonInteraction, CommandInteraction, Guild, TextBasedChannel, TextChannel } from 'discord.js';
import { GuildMember } from 'discord.js';
import { Discord } from 'discordx';

import { MusicQueue } from './MusicQueue.js';

@Discord()
export class MusicPlayer {
	queueManager: QueueManager | null = null;

	getQueue(guildId: string): MusicQueue | null {
		if (!this.queueManager) {
			return null;
		}

		const queue = new MusicQueue(this.queueManager.node, guildId);
		return this.queueManager.queue(guildId, () => queue);
	}

	async parseCommand(interaction: CommandInteraction | ButtonInteraction): Promise<
		| {
				channel: TextBasedChannel;
				guild: Guild;
				member: GuildMember;
				queue: MusicQueue;
		  }
		| undefined
	> {
		await interaction.deferReply();

		if (!interaction.channel || !(interaction.member instanceof GuildMember) || !interaction.guild) {
			await interaction.followUp('> Não foi possível processar o comando. Tente novamente');
			return;
		}

		if (!interaction.member.voice.channelId) {
			await interaction.followUp('> Entre em um canal de voz primeiro.');
			return;
		}

		const bot = interaction.guild.members.cache.get(interaction.client.user.id);

		if (!bot) {
			await interaction.followUp('> Onde é que eu to? Será que estou em Alagoinha?');
			return;
		}

		const queue = this.getQueue(interaction.guild.id);

		if (!queue) {
			await interaction.followUp('> O reprodutor de música ainda não está pronto. Tente novamente mais tarde');
			return;
		}

		if (bot.voice.channelId === null) {
			queue.channel = interaction.channel as TextChannel;

			await queue.guildPlayer.join({
				channel: interaction.member.voice.channelId,
				deaf: true,
			});
		} else if (interaction.member.voice.channelId !== bot.voice.channelId) {
			await interaction.followUp('> Entre no mesmo canal de voz que eu primeiro');
			return;
		}

		return {
			channel: interaction.channel,
			guild: interaction.guild,
			member: interaction.member,
			queue,
		};
	}
}
