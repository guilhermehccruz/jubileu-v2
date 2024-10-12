import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { LyricsService } from '../services/LyricsService.js';

@Discord()
@injectable()
export class LyricsButton {
	constructor(private readonly lyricsService: LyricsService) {}

	@ButtonComponent({ id: 'btn-lyrics' })
	async button(interaction: ButtonInteraction): Promise<void> {
		await this.lyricsService.execute(interaction);
	}

	static button() {
		return new ButtonBuilder()
			.setLabel('Letra')
			.setEmoji('🎤')
			.setStyle(ButtonStyle.Primary)
			.setCustomId('btn-lyrics');
	}
}
