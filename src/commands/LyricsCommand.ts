import type { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { injectable } from 'tsyringe';

import { LyricsService } from '../services/LyricsService.js';

@Discord()
@injectable()
export class LyricsCommand {
	constructor(private readonly lyricsService: LyricsService) {}

	@Slash({ description: 'Busca as letras da música tocando' })
	async lyrics(interaction: CommandInteraction): Promise<void> {
		await this.lyricsService.execute(interaction);
	}
}
