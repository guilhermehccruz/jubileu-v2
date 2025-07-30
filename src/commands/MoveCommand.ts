import { ApplicationCommandOptionType } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Discord, SlashOption } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../core/music/MusicPlayer.js';
import { SlashWithAliases } from '../decorators/SlashWithAliases.js';

@Discord()
@injectable()
export class MoveCommand {
	@SlashWithAliases(
		{
			name: 'move',
			description: 'Move the song from "initial position" to "final position"',
			descriptionLocalizations: {
				'pt-BR': 'Troca a posição da música, tirando de "posição-inicial" e colocando em "posição-final"',
			},
		},
		['mover'],
	)
	async move(
		@SlashOption({
			name: 'current-position',
			nameLocalizations: { 'pt-BR': 'posição-atual' },
			description: 'Current position in the queue',
			descriptionLocalizations: { 'pt-BR': 'Posição atual da música na fila' },
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		currentPosition: number,
		@SlashOption({
			name: 'new-position',
			nameLocalizations: { 'pt-BR': 'nova-posição' },
			description: 'New song position in the queue',
			descriptionLocalizations: { 'pt-BR': 'Nova posição da música na fila' },
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		newPosition: number,
		interaction: CommandInteraction,
	): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		if (currentPosition < 1 || currentPosition > queue.size) {
			await interaction.followUp({ content: '> Posição inicial não encontrada na fila', ephemeral: true });
			return;
		}

		if (currentPosition === newPosition) {
			await interaction.followUp({
				content: '> Posição inicial não pode ser a mesma da posição final',
				ephemeral: true,
			});
			return;
		}

		if (newPosition < 1) {
			newPosition = 1;
		} else if (newPosition > queue.size) {
			newPosition = queue.size;
		}

		queue.changeTrackPosition(currentPosition - 1, newPosition - 1);

		await interaction.followUp('> Música movida');
		return;
	}
}
