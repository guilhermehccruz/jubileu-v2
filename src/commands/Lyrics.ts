import { MusicQueue } from '@/utils/music/MusicQueue.js';
import { EmbedBuilder } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import Genius from 'genius-lyrics';
import { find } from 'llyrics';
import lyricsSearcher from 'lyrics-searcher';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class Lyrics {
	constructor(private readonly musicPlayer: MusicPlayer) {}

	@Slash({ description: 'Busca as letras da música tocando' })
	async lyrics(interaction: CommandInteraction): Promise<void> {
		const cmd = await this.musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

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

		let lyrics = await this.getLyrics(queue);

		if (!lyrics) {
			await interaction.followUp('> Letra não encontrada');
			return;
		}

		lyrics = lyrics.replaceAll(/\[.*\]\n/g, '');

		const embeds = this.getEmbeds(lyrics);

		embeds[0].setTitle(`${queue.currentPlaybackTrack.info.author} - ${queue.currentPlaybackTrack.info.title}`);

		if (queue.currentPlaybackTrack.info.uri) {
			embeds[0].setURL(queue.currentPlaybackTrack.info.uri);
		}

		if (queue.currentPlaybackTrack.info.artworkUrl) {
			embeds[0].setThumbnail(queue.currentPlaybackTrack.info.artworkUrl);
		}

		await interaction.followUp({ embeds });

		await queue.updateControlMessage();
	}

	private async getLyrics(queue: MusicQueue): Promise<string | undefined> {
		try {
			if (!queue.currentPlaybackTrack) {
				return;
			}

			const title = queue.currentPlaybackTrack.info.title.replaceAll(/\(.*\)/g, '');

			const lavaLyricsResult = await queue.getCurrentPlaybackLyrics().catch(() => undefined);

			if (lavaLyricsResult) {
				return lavaLyricsResult.lines.map((line) => line.line).join('\n');
			}

			const lyricsSearcherResult = await lyricsSearcher('', title).catch(() => undefined);

			if (lyricsSearcherResult) {
				return lyricsSearcherResult;
			}

			const geniusResult = await new Genius.Client(process.env.GENIUS_ACCESS_TOKEN).songs
				.search(title)
				.catch(() => undefined);

			if (geniusResult?.length) {
				const lyrics = await geniusResult[0].lyrics().catch(() => undefined);

				if (lyrics) {
					return lyrics;
				}
			}

			const llyricsResult = await find({
				song: title,
				geniusApiKey: process.env.GENIUS_ACCESS_TOKEN,
				forceSearch: true,
			}).catch(() => undefined);

			if (llyricsResult?.lyrics) {
				return llyricsResult.lyrics;
			}
		} catch (error) {
			console.error(error);

			return;
		}
	}

	private getEmbeds(lyrics: string): EmbedBuilder[] {
		if (lyrics.length <= 4096) {
			const embed = new EmbedBuilder().setDescription(lyrics);

			return [embed];
		}

		const embeds: EmbedBuilder[] = [];

		let currentString = '';
		const splits = lyrics.split('\n');
		for (const split of splits) {
			if (currentString.length + split.length + 1 > 4096) {
				embeds.push(new EmbedBuilder().setDescription(currentString));

				currentString = '';
			}

			currentString += currentString ? `\n${split}` : split;
		}

		if (currentString) {
			embeds.push(new EmbedBuilder().setDescription(currentString));
		}

		return embeds;
	}
}
