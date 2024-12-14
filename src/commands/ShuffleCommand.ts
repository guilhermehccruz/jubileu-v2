import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { injectable } from 'tsyringe';

import { ShuffleService } from '../services/ShuffleService.js';

@Discord()
@injectable()
export class ShuffleCommand {
	constructor(private readonly shuffleService: ShuffleService) {}

	@Slash({ description: 'Aleatoriza as músicas na fila' })
	async shuffle(interaction: CommandInteraction): Promise<void> {
		await this.shuffleService.execute(interaction);
	}
}
