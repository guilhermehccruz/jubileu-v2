import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../core/music/MusicPlayer.js';

@Discord()
@injectable()
export class QueueButton {
	@ButtonComponent({ id: 'btn-queue' })
	async button(interaction: ButtonInteraction): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		await queue.view(interaction);
	}

	static button() {
		return new ButtonBuilder()
			.setLabel('Fila')
			.setEmoji('🎶')
			.setStyle(ButtonStyle.Primary)
			.setCustomId('btn-queue');
	}
}
