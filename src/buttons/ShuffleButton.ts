import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { ShuffleService } from '../services/ShuffleService.js';

@Discord()
@injectable()
export class ShuffleButton {
	constructor(private readonly shuffleService: ShuffleService) {}

	@ButtonComponent({ id: 'btn-shuffle' })
	async button(interaction: ButtonInteraction): Promise<void> {
		await this.shuffleService.execute(interaction);
	}

	static button(isPlaying: boolean) {
		return new ButtonBuilder()
			.setLabel('Aleatorizar')
			.setEmoji('🎛️')
			.setDisabled(!isPlaying)
			.setStyle(ButtonStyle.Primary)
			.setCustomId('btn-shuffle');
	}
}
