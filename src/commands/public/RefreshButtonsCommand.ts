import type { CommandInteraction } from 'discord.js';
import { Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../../core/music/MusicPlayer.js';
import { SlashWithAliases } from '../../decorators/SlashWithAliases.js';

@Discord()
@injectable()
export class RefreshButtonsCommand {
	@SlashWithAliases(
		{
			name: 'refresh-buttons',
			description: 'Refreshes the interaction buttons',
			descriptionLocalizations: { 'pt-BR': 'Recarrega os botões de interação' },
		},
		['recarregar-botoes'],
	)
	async refresh(interaction: CommandInteraction): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		await interaction.deleteReply();

		await queue.updateControlMessage({ force: true });
	}
}
