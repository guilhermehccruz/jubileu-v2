import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { ButtonComponent, Client, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class QueueControl {
	constructor(private musicPlayer: MusicPlayer) {}

	@ButtonComponent({ id: 'btn-queue' })
	async queueControl(interaction: ButtonInteraction, client: Client): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		await queue.view(interaction as unknown as CommandInteraction);
	}
}
