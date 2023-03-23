import { ButtonInteraction } from 'discord.js';
import type { Client } from 'discordx';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class PauseControl {
	constructor(private musicPlayer: MusicPlayer) {}

	@ButtonComponent({ id: 'btn-pause' })
	async pauseControl(interaction: ButtonInteraction, client: Client): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		queue.isPlaying ? queue.pause() : queue.resume();
		await queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}
}
