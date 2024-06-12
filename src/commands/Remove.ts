import { ApplicationCommandOptionType } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Client, Discord, Slash, SlashOption } from 'discordx';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '@/utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class Remove {
	constructor(private readonly musicPlayer: MusicPlayer) {}

	@Slash({ description: 'Remove a música da fila na posição digitada' })
	async remove(
		@SlashOption({
			name: 'posição',
			description: 'Posição que a música está na fila',
			required: true,
			type: ApplicationCommandOptionType.Integer,
		})
		position: number,
		interaction: CommandInteraction,
		client: Client,
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
