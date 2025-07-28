import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../core/music/MusicPlayer.js';

@Discord()
@injectable()
export class LeaveService {
	async execute(interaction: CommandInteraction | ButtonInteraction) {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		await queue.exit();
		await queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}
}
