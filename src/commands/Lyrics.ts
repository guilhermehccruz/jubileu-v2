import { EmbedBuilder } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Client, Discord, Slash } from 'discordx';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class Lyrics {
	constructor(private readonly musicPlayer: MusicPlayer) {}

	@Slash({ description: 'Busca as letras da música tocando' })
	async lyrics(interaction: CommandInteraction, client: Client): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction);
		if (!cmd) {
			return;
		}

		const { queue, guild } = cmd;

		if (!queue.currentPlaybackTrack) {
			await interaction.followUp('> Não tem nada tocando');

			await queue.exit();
			return;
		}

		if (!queue.currentPlaybackTrack.info.isSeekable) {
			await interaction.followUp('> Não é possível pegar a letra de uma livestream.');
			return;
		}

		if (queue.currentPlaybackTrack.info.sourceName === 'flowery-tts') {
			await interaction.followUp(`\`\`\`${queue.currentPlaybackTrack.info.title}\`\`\``);
			return;
		}

		const response = await queue.lavaPlayer.node.rest.getCurrentPlaybackLyrics(guild.id);

		if (!response) {
			await interaction.followUp('> Letra não encontrada');
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle(`${queue.currentPlaybackTrack.info.author} - ${queue.currentPlaybackTrack.info.title}`)
			.setDescription(response.lines.map((line) => line.line).join('\n'));

		if (queue.currentPlaybackTrack.info.uri) {
			embed.setURL(queue.currentPlaybackTrack.info.uri);
		}

		if (queue.currentPlaybackTrack.info.artworkUrl) {
			embed.setThumbnail(queue.currentPlaybackTrack.info.artworkUrl);
		}

		await interaction.followUp({ embeds: [embed] });

		await queue.updateControlMessage();
	}
}
