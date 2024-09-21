import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class QueueButton {
	constructor(private readonly musicPlayer: MusicPlayer) {}

	@ButtonComponent({ id: 'btn-queue' })
	async queueButton(interaction: ButtonInteraction): Promise<void> {
		const cmd = await this.musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		await queue.view(interaction);
	}

	static button() {
		return new ButtonBuilder()
			.setLabel('Fila')
			.setEmoji('🎵')
			.setStyle(ButtonStyle.Primary)
			.setCustomId('btn-queue');
	}
}
