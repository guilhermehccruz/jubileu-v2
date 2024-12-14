import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { injectable } from 'tsyringe';

import { NextService } from '../services/NextService.js';

@Discord()
@injectable()
export class NextButton {
	constructor(private readonly nextService: NextService) {}

	@Slash({ description: 'Pula para a próxima música na fila' })
	async next(interaction: CommandInteraction): Promise<void> {
		await this.nextService.execute(interaction);
	}

	@Slash({ description: 'Pula para a próxima música na fila' })
	async skip(interaction: CommandInteraction): Promise<void> {
		await this.nextService.execute(interaction);
	}
}
