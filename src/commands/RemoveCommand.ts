import { ApplicationCommandOptionType } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../core/music/MusicPlayer.js';

@Discord()
@injectable()
export class RemoveCommand {
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
	): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		if (position < 1 || position > queue.size) {
			await interaction.followUp({ content: '> Posição não encontrada na fila', ephemeral: true });
			return;
		}

		queue.removeTracks(position - 1);

		await interaction.followUp('> Música removida');
		return;
	}
}
