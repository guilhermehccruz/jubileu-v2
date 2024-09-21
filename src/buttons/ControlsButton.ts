import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class ControlsButton {
	@ButtonComponent({ id: 'btn-controls' })
	async controlsButton(interaction: ButtonInteraction): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		await queue.updateControlMessage({ force: true });

		// delete interaction
		await interaction.deleteReply();
	}

	static button() {
		return new ButtonBuilder()
			.setLabel('Atualizar controles')
			.setEmoji('🔄')
			.setStyle(ButtonStyle.Primary)
			.setCustomId('btn-controls');
	}
}
