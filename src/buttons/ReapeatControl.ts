import { RepeatMode } from '@discordx/lava-queue';
import { ButtonInteraction } from 'discord.js';
import { ButtonComponent, Client, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '@/utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class RepeatControl {
	constructor(private readonly musicPlayer: MusicPlayer) {}

	@ButtonComponent({ id: 'btn-repeat' })
	async repeatControl(interaction: ButtonInteraction, client: Client): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		queue.setRepeatMode(queue.repeatMode === RepeatMode.REPEAT_ONE ? RepeatMode.OFF : RepeatMode.REPEAT_ONE);
		await queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}
}
