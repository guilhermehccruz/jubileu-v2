import { CommandInteraction } from 'discord.js';
import { Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { SlashWithAliases } from '../../decorators/SlashWithAliases.js';
import { PauseService } from '../../services/PauseService.js';

@Discord()
@injectable()
export class PauseCommand {
	constructor(private readonly pauseService: PauseService) {}

	@SlashWithAliases(
		{
			name: 'pause',
			description: 'Pauses or unpauses the current song',
			descriptionLocalizations: { 'pt-BR': 'Pausa ou retoma a música tocando' },
		},
		['unpause'],
	)
	async pause(interaction: CommandInteraction): Promise<void> {
		await this.pauseService.execute(interaction);
	}
}
