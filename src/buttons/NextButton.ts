import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { NextService } from '../services/NextService.js';

@Discord()
@injectable()
export class NextButton {
	constructor(private readonly nextService: NextService) {}

	@ButtonComponent({ id: 'btn-next' })
	async button(interaction: ButtonInteraction): Promise<void> {
		await this.nextService.execute(interaction);
	}

	static button(isPlaying: boolean) {
		return new ButtonBuilder()
			.setLabel('Próximo')
			.setEmoji('⏭')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(!isPlaying)
			.setCustomId('btn-next');
	}
}
