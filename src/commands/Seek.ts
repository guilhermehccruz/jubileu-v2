import {} from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Client } from 'discordx';
import { Discord, Slash, SlashOption } from 'discordx';
import { inject, injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class Seek {
	constructor(
		@inject(MusicPlayer)
		private musicPlayer: MusicPlayer
	) {}

	@Slash({ description: 'Toca a música a partir do segundo digitado' })
	async seek(
		@SlashOption({ name: 'segundos' }) seconds: number,
		interaction: CommandInteraction,
		client: Client
	): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		if (!queue.currentTrack) {
			await interaction.followUp('> Não tem nada tocando');
			return;
		}

		if (!queue.currentTrack.info.isSeekable) {
			await interaction.followUp('> Não é possível alterar o tempo de uma livestream.');
			return;
		}

		if (seconds * 1000 > queue.currentTrack.info.length) {
			await interaction.followUp('> Segundos excede a duração da música');
			return;
		}

		await queue.lavaPlayer.play(queue.currentTrack, { start: seconds * 1000 });

		await interaction.followUp('> Pulado até o segundo requisitado');
		return;
	}
}
