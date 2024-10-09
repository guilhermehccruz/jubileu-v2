import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class LeaveButton {
	@ButtonComponent({ id: 'btn-leave' })
	async leaveButton(interaction: ButtonInteraction): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		await queue.exit();
		await queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}

	static button() {
		return new ButtonBuilder()
			.setLabel('Sair')
			.setEmoji('⏹️')
			.setStyle(ButtonStyle.Danger)
			.setCustomId('btn-leave');
	}
}
