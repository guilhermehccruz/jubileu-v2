import {} from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Client } from 'discordx';
import { Discord, Slash, SlashOption } from 'discordx';
import { inject, injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class Move {
	constructor(
		@inject(MusicPlayer)
		private musicPlayer: MusicPlayer
	) {}

	@Slash({ description: 'Troca a música de lugar, tirando de "posição-inicial" e colocando em "posição-final"' })
	async move(
		@SlashOption({ name: 'posição-inicial' }) initialPosition: number,
		@SlashOption({ name: 'posição-final' }) finalPosition: number,
		interaction: CommandInteraction,
		client: Client
	): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		if (initialPosition < 1 || initialPosition > queue.size) {
			await interaction.followUp('> Posição inicial não encontrada na fila');
			return;
		}

		if (initialPosition === finalPosition) {
			await interaction.followUp('> Posição inicial não pode ser a mesma da posição final');
			return;
		}

		if (finalPosition < 1) {
			finalPosition = 1;
		} else if (finalPosition > queue.size) {
			finalPosition = queue.size;
		}

		queue.tracks.splice(finalPosition - 1, 0, queue.tracks.splice(initialPosition - 1, 1)[0]);

		await interaction.followUp('> Música movida');
		return;
	}
}
