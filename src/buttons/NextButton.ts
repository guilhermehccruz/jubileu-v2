import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class NextButton {
	constructor(private readonly musicPlayer: MusicPlayer) {}

	@ButtonComponent({ id: 'btn-next' })
	async nextButton(interaction: ButtonInteraction): Promise<void> {
		const cmd = await this.musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const next = await cmd.queue.playNext();
		if (!next) {
			await cmd.queue.exit();
		}

		// update controls
		await cmd.queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}

	static button(isPlaying: boolean) {
		return new ButtonBuilder()
			.setLabel('Próximo')
			.setEmoji('⏭')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(isPlaying)
			.setCustomId('btn-next');
	}
}
