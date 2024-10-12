import { ButtonInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { injectable } from 'tsyringe';

import { LoopService } from '../services/LoopService.js';

@Discord()
@injectable()
export class LoopCommand {
	constructor(private readonly loopService: LoopService) {}

	@Slash({ description: 'Coloca ou tira a fila do modo loop' })
	async loop(interaction: ButtonInteraction): Promise<void> {
		await this.loopService.execute(interaction);
	}
}
