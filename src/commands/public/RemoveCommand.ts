import { ApplicationCommandOptionType } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Discord, SlashOption } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../../core/music/MusicPlayer.js';
import { SlashWithAliases } from '../../decorators/SlashWithAliases.js';

@Discord()
@injectable()
export class RemoveCommand {
	@SlashWithAliases(
		{
			name: 'remove',
			nameLocalizations: { 'pt-BR': 'remover' },
			description: 'Removes the song from the indicated positions',
			descriptionLocalizations: { 'pt-BR': 'Remove a música da fila na posição digitada' },
		},
		['remover'],
	)
	async remove(
		@SlashOption({
			name: 'position',
			nameLocalizations: { 'pt-BR': 'posição' },
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
