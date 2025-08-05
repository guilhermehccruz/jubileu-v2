import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { injectable } from 'tsyringe';

import { LoopService } from '../../services/LoopService.js';

@Discord()
@injectable()
export class LoopCommand {
	constructor(private readonly loopService: LoopService) {}

	@Slash({
		name: 'loop',
		description: 'Enable or disable loop mode for the queue',
		descriptionLocalizations: { 'pt-BR': 'Coloca ou tira a fila do modo loop' },
	})
	async loop(interaction: CommandInteraction): Promise<void> {
		await this.loopService.execute(interaction);
	}
}
