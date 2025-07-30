import { CommandInteraction } from 'discord.js';
import { Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { SlashWithAliases } from '../decorators/SlashWithAliases.js';
import { ShuffleService } from '../services/ShuffleService.js';

@Discord()
@injectable()
export class ShuffleCommand {
	constructor(private readonly shuffleService: ShuffleService) {}

	@SlashWithAliases(
		{
			name: 'shuffle',
			description: 'Shuffles the queue',
			descriptionLocalizations: { 'pt-BR': 'Aleatoriza as músicas na fila' },
		},
		['aleatorizar'],
	)
	async shuffle(interaction: CommandInteraction): Promise<void> {
		await this.shuffleService.execute(interaction);
	}
}
