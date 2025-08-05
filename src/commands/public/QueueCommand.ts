import { CommandInteraction } from 'discord.js';
import { Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../../core/music/MusicPlayer.js';
import { SlashWithAliases } from '../../decorators/SlashWithAliases.js';

@Discord()
@injectable()
export class QueueButton {
	@SlashWithAliases(
		{
			name: 'queue',
			description: 'Gets que current queue',
			descriptionLocalizations: { 'pt-BR': 'Traz a fila atual' },
		},
		['fila'],
	)
	async button(interaction: CommandInteraction): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		await queue.view(interaction);
	}
}
