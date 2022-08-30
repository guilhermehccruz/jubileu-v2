import { ButtonInteraction } from 'discord.js';
import { ButtonComponent, Client, Discord } from 'discordx';
import { inject, injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class LeaveControl {
	constructor(
		@inject(MusicPlayer)
		private musicPlayer: MusicPlayer
	) {}

	@ButtonComponent({ id: 'btn-leave' })
	async leaveControl(interaction: ButtonInteraction, client: Client): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		await queue.leave();
		await queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}
}
