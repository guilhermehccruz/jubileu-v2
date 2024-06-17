import { ApplicationCommandOptionType } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class Move {
	constructor(private readonly musicPlayer: MusicPlayer) {}

	@Slash({ description: 'Troca a música de lugar, tirando de "posição-inicial" e colocando em "posição-final"' })
	async move(
		@SlashOption({
			name: 'posição-inicial',
			description: 'Posição que a música está na fila',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		initialPosition: number,
		@SlashOption({
			name: 'posição-final',
			description: 'Posição que a música vai ficar na fila',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		finalPosition: number,
		interaction: CommandInteraction,
	): Promise<void> {
		const cmd = await this.musicPlayer.parseCommand(interaction);
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

		queue.changeTrackPosition(initialPosition - 1, finalPosition - 1);

		await interaction.followUp('> Música movida');
		return;
	}
}
