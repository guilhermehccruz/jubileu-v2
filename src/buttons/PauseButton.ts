import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { PauseService } from '../services/PauseService.js';

@Discord()
@injectable()
export class PauseButton {
	constructor(private readonly pauseService: PauseService) {}

	@ButtonComponent({ id: 'btn-pause' })
	async button(interaction: ButtonInteraction): Promise<void> {
		await this.pauseService.execute(interaction);
	}

	static button(isPlaying: boolean) {
		return new ButtonBuilder()
			.setLabel(isPlaying ? 'Pausar' : 'Continuar')
			.setEmoji(isPlaying ? '⏸️' : '▶️')
			.setStyle(ButtonStyle.Primary)
			.setCustomId('btn-pause');
	}
}
