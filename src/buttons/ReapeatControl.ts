import { ButtonInteraction } from 'discord.js';
import { ButtonComponent, Client, Discord } from 'discordx';
import { inject, injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class RepeatControl {
	constructor(
		@inject(MusicPlayer)
		private musicPlayer: MusicPlayer
	) {}

	@ButtonComponent({ id: 'btn-repeat' })
	async repeatControl(interaction: ButtonInteraction, client: Client): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		queue.setRepeat(!queue.repeat);
		await queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}
}
