import { Player } from '@discordx/lava-queue';
import type { ButtonInteraction, CommandInteraction, Guild, TextBasedChannel } from 'discord.js';
import { GuildMember } from 'discord.js';
import type { Client } from 'discordx';
import { Discord } from 'discordx';

import { MusicQueue } from './MusicQueue.js';

@Discord()
export class MusicPlayer {
	player: Record<string, Player> = {};

	GetQueue(botId: string, guildId: string): MusicQueue | null {
		const player = this.player[botId];

		const queue = new MusicQueue(player, guildId);

		return player.queue(guildId, () => queue);
	}

	async ParseCommand(
		client: Client,
		interaction: CommandInteraction | ButtonInteraction,
	): Promise<
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

		const queue = this.GetQueue(client.botId, interaction.guild.id);

		if (!queue) {
			await interaction.followUp('> O reprodutor de música ainda não está pronto. Tente novamente mais tarde');
			return;
		}

		if (bot.voice.channelId === null) {
			queue.channel = interaction.channel;

			await queue.lavaPlayer.join({
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
