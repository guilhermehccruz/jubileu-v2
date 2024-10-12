import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class ShuffleService {
	async execute(interaction: CommandInteraction | ButtonInteraction): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		queue.shuffleTracks();
		await queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}
}
