import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class PauseService {
	async execute(interaction: CommandInteraction | ButtonInteraction): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		cmd.queue.isPlaying ? await cmd.queue.pause() : await cmd.queue.resume();
		await cmd.queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}
}
