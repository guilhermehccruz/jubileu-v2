import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class MixButton {
	@ButtonComponent({ id: 'btn-mix' })
	async button(interaction: ButtonInteraction): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		queue.shuffleTracks();
		await queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}

	static button(isPlaying: boolean) {
		return new ButtonBuilder()
			.setLabel('Aleatorizar')
			.setEmoji('🎛️')
			.setDisabled(!isPlaying)
			.setStyle(ButtonStyle.Primary)
			.setCustomId('btn-mix');
	}
}
