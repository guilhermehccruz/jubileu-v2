import { ApplicationCommandOptionType } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../utils/music/MusicPlayer.js';
@Discord()
@injectable()
export class Seek {
	@Slash({ description: 'Toca a música a partir do segundo digitado' })
	async seek(
		@SlashOption({
			name: 'segundos',
			description: 'O segundo que a música deve começar',
			required: true,
			type: ApplicationCommandOptionType.Integer,
		})
		seconds: number,
		interaction: CommandInteraction,
	): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		if (!queue.currentPlaybackTrack) {
			await interaction.followUp('> Não tem nada tocando');
			return;
		}

		if (!queue.currentPlaybackTrack.info.isSeekable) {
			await interaction.followUp('> Não é possível alterar o tempo de uma livestream.');
			return;
		}

		if (seconds * 1000 > queue.currentPlaybackTrack.info.length) {
			await interaction.followUp('> Segundos excede a duração da música');
			return;
		}

		await queue.guildPlayer.update({ position: seconds * 1000 });

		await interaction.followUp('> Pulado até o segundo requisitado');
		return;
	}
}
