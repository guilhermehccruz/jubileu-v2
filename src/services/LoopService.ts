import { RepeatMode } from '@discordx/lava-queue';
import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class LoopService {
	async execute(interaction: CommandInteraction | ButtonInteraction) {
		const cmd = await musicPlayer.parseCommand(interaction);
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
