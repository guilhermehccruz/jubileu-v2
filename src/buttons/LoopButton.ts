import { RepeatMode } from '@discordx/lava-queue';
import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class LoopButton {
	@ButtonComponent({ id: 'btn-loop' })
	async loopButton(interaction: ButtonInteraction): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		queue.setRepeatMode(queue.repeatMode === RepeatMode.REPEAT_ALL ? RepeatMode.OFF : RepeatMode.REPEAT_ALL);
		await queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
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
