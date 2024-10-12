import { RepeatMode } from '@discordx/lava-queue';
import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { LoopService } from '../services/LoopService.js';

@Discord()
@injectable()
export class LoopButton {
	constructor(private readonly loopService: LoopService) {}
	@ButtonComponent({ id: 'btn-loop' })
	async button(interaction: ButtonInteraction): Promise<void> {
		await this.loopService.execute(interaction);
	}

	static button(isPlaying: boolean, repeatMode: RepeatMode) {
		return new ButtonBuilder()
			.setLabel('Loop na fila')
			.setEmoji('🔁')
			.setDisabled(!isPlaying)
			.setStyle(repeatMode === RepeatMode.REPEAT_ALL ? ButtonStyle.Danger : ButtonStyle.Primary)
			.setCustomId('btn-loop');
	}
}
