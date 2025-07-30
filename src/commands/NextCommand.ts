import { CommandInteraction } from 'discord.js';
import { Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { SlashWithAliases } from '../decorators/SlashWithAliases.js';
import { NextService } from '../services/NextService.js';

@Discord()
@injectable()
export class NextButton {
	constructor(private readonly nextService: NextService) {}

	@SlashWithAliases(
		{
			name: 'next',
			description: 'Skips to the next song in the queue',
			descriptionLocalizations: { 'pt-BR': 'Pula para a próxima música na fila' },
		},
		['skip', 'proximo', 'pular'],
	)
	async next(interaction: CommandInteraction): Promise<void> {
		await this.nextService.execute(interaction);
	}
}
