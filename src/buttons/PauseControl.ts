import { ButtonInteraction } from 'discord.js';
import type { Client } from 'discordx';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '@/utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class PauseControl {
	constructor(private readonly musicPlayer: MusicPlayer) {}

	@ButtonComponent({ id: 'btn-pause' })
	async pauseControl(interaction: ButtonInteraction, client: Client): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction);
		if (!cmd) {
			return;
		}

		cmd.queue.isPlaying ? await cmd.queue.pause() : await cmd.queue.resume();
		await cmd.queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}
}
