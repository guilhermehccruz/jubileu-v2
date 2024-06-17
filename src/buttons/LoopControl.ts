import { RepeatMode } from '@discordx/lava-queue';
import { ButtonInteraction } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class LoopControl {
	constructor(private readonly musicPlayer: MusicPlayer) {}

	@ButtonComponent({ id: 'btn-loop' })
	async loopControl(interaction: ButtonInteraction): Promise<void> {
		const cmd = await this.musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		queue.setRepeatMode(queue.repeatMode === RepeatMode.REPEAT_ALL ? RepeatMode.OFF : RepeatMode.REPEAT_ALL);
		await queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}
}
