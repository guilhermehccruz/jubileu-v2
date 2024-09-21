import { RepeatMode } from '@discordx/lava-queue';
import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class RepeatButton {
	constructor(private readonly musicPlayer: MusicPlayer) {}

	@ButtonComponent({ id: 'btn-repeat' })
	async repeatButton(interaction: ButtonInteraction): Promise<void> {
		const cmd = await this.musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		queue.setRepeatMode(queue.repeatMode === RepeatMode.REPEAT_ONE ? RepeatMode.OFF : RepeatMode.REPEAT_ONE);
		await queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}

	static button(isPlaying: boolean, repeatMode: RepeatMode) {
		return new ButtonBuilder()
			.setLabel('Repetir Música atual')
			.setEmoji('🔂')
			.setDisabled(!isPlaying)
			.setStyle(repeatMode === RepeatMode.REPEAT_ONE ? ButtonStyle.Danger : ButtonStyle.Primary)
			.setCustomId('btn-repeat');
	}
}
