import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class PauseButton {
	@ButtonComponent({ id: 'btn-pause' })
	async pauseButton(interaction: ButtonInteraction): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		cmd.queue.isPlaying ? await cmd.queue.pause() : await cmd.queue.resume();
		await cmd.queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}

	static button(isPlaying: boolean) {
		return new ButtonBuilder()
			.setLabel(isPlaying ? 'Pausar' : 'Continuar')
			.setEmoji(isPlaying ? '⏸️' : '▶️')
			.setStyle(ButtonStyle.Primary)
			.setCustomId('btn-pause');
	}
}
