import {} from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import type { Client } from 'discordx';
import { Discord, Slash, SlashOption } from 'discordx';
import { inject, injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class Remove {
	constructor(
		@inject(MusicPlayer)
		private musicPlayer: MusicPlayer
	) {}

	@Slash()
	async remove(
		@SlashOption({ name: 'posição' }) position: number,
		interaction: CommandInteraction,
		client: Client
	): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		if (position < 1 || position > queue.size) {
			await interaction.followUp('> Posição não encontrada na fila');
			return;
		}

		queue.tracks.splice(position - 1, 1);

		await interaction.followUp('> Música removida');
		return;
	}
}
