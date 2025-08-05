import type { CommandInteraction } from 'discord.js';
import { Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { SlashWithAliases } from '../../decorators/SlashWithAliases.js';
import { LyricsService } from '../../services/LyricsService.js';

@Discord()
@injectable()
export class LyricsCommand {
	constructor(private readonly lyricsService: LyricsService) {}

	@SlashWithAliases(
		{
			name: 'lyrics',
			description: 'Search lyrics of the current song',
			descriptionLocalizations: { 'pt-BR': 'Busca as letras da música tocando' },
		},
		['letra'],
	)
	async lyrics(interaction: CommandInteraction): Promise<void> {
		await this.lyricsService.execute(interaction);
	}
}
