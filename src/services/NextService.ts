import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class NextService {
	async execute(interaction: CommandInteraction | ButtonInteraction): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const next = await cmd.queue.playNext();
		if (!next) {
			await cmd.queue.exit();
		}

		// update controls
		await cmd.queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}
}
