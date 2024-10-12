import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { injectable } from 'tsyringe';

import { PauseService } from '../services/PauseService.js';

@Discord()
@injectable()
export class PauseCommand {
	constructor(private readonly pauseService: PauseService) {}

	@Slash({ description: 'Pausa ou retoma a música tocando' })
	async pause(interaction: CommandInteraction): Promise<void> {
		await this.pauseService.execute(interaction);
	}
}
