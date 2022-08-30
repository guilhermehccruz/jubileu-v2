import { ButtonInteraction } from 'discord.js';
import { ButtonComponent, Client, Discord } from 'discordx';
import { inject, injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class NextControl {
	constructor(
		@inject(MusicPlayer)
		private musicPlayer: MusicPlayer
	) {}

	@ButtonComponent({ id: 'btn-next' })
	async nextControl(interaction: ButtonInteraction, client: Client): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		const next = queue.playNext();
		if (!next) {
			await queue.leave();
		}

		// update controls
		await queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}
}
