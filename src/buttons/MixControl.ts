import { ButtonInteraction } from 'discord.js';
import { ButtonComponent, Client, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class MixControl {
	constructor(private musicPlayer: MusicPlayer) {}

	@ButtonComponent({ id: 'btn-mix' })
	async mixControl(interaction: ButtonInteraction, client: Client): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		queue.shuffle();
		await queue.updateControlMessage();

		// delete interaction
		await interaction.deleteReply();
	}
}
