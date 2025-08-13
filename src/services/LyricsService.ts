import { EmbedBuilder } from 'discord.js';
import type { ButtonInteraction, CommandInteraction } from 'discord.js';
import { Discord } from 'discordx';
import { find } from 'llyrics';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../core/music/MusicPlayer.js';
import { MusicQueue } from '../core/music/MusicQueue.js';

const EMBED_MAX_SIZE = 4_096;

@Discord()
@injectable()
export class LyricsService {
	async execute(interaction: CommandInteraction | ButtonInteraction): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		if (!queue.currentPlaybackTrack) {
			await interaction.followUp({ content: '> Não tem nada tocando', ephemeral: true });

			await queue.exit();
			return;
		}

		if (!queue.currentPlaybackTrack.info.isSeekable) {
			await interaction.followUp({
				content: '> Não é possível pegar a letra de uma livestream.',
				ephemeral: true,
			});
			return;
		}

		if (queue.currentPlaybackTrack.info.sourceName === 'flowery-tts') {
			await interaction.followUp(`\`\`\`${queue.currentPlaybackTrack.info.title}\`\`\``);
			return;
		}

		const lyrics = await this.getLyrics(queue);

		if (!lyrics) {
			await interaction.followUp({ content: '> Letra não encontrada', ephemeral: true });
			return;
		}

		const embeds = this.getEmbeds(lyrics);

		embeds[0].setTitle(`${queue.currentPlaybackTrack.info.author} - ${queue.currentPlaybackTrack.info.title}`);

		if (queue.currentPlaybackTrack.info.uri) {
			embeds[0].setURL(queue.currentPlaybackTrack.info.uri);
		}

		if (queue.currentPlaybackTrack.info.artworkUrl) {
			embeds[0].setThumbnail(queue.currentPlaybackTrack.info.artworkUrl);
		}

		for (const embed of embeds) {
			await interaction.followUp({ embeds: [embed] });
		}

		await queue.updateControlMessage();
	}

	private async getLyrics(queue: MusicQueue): Promise<string | undefined> {
		try {
			if (!queue.currentPlaybackTrack) {
				return;
			}

			const result = await find({
				song: queue.currentPlaybackTrack.info.title.replaceAll(/\(.*\)/g, ''),
				artist: queue.currentPlaybackTrack.info.author,
				forceSearch: true,
			});

			return result.lyrics.replaceAll('\r', '').replaceAll(/\[.*\]\n/g, '');
		} catch (error) {
			console.error(error);

			return;
		}
	}

	private getEmbeds(lyrics: string): EmbedBuilder[] {
		if (lyrics.length <= EMBED_MAX_SIZE) {
			return [new EmbedBuilder().setDescription(lyrics)];
		}

		const embedsCount = Math.ceil(lyrics.length / EMBED_MAX_SIZE);
		const averageWordsPerEmbed = Math.floor(lyrics.length / embedsCount);

		const embeds: EmbedBuilder[] = [];

		const { splitLyrics, separator } = this.splitLyrics(lyrics);

		let currentEmbed = '';
		for (const split of splitLyrics) {
			currentEmbed += currentEmbed ? `${separator}${split}` : split;

			if (currentEmbed.length >= averageWordsPerEmbed) {
				embeds.push(new EmbedBuilder().setDescription(currentEmbed));

				currentEmbed = '';
			}
		}

		if (currentEmbed) {
			embeds.push(new EmbedBuilder().setDescription(currentEmbed));
		}

		return embeds;
	}

	private splitLyrics(lyrics: string): { splitLyrics: string[]; separator: '\n\n' | '\n' } {
		const doubleLineBreaksCount = lyrics.match(/\n\n/g)?.length ?? 0;

		return doubleLineBreaksCount >= 10
			? { splitLyrics: lyrics.split('\n\n'), separator: '\n\n' }
			: { splitLyrics: lyrics.replaceAll('\n\n', '\n').split('\n'), separator: '\n' };
	}
}
