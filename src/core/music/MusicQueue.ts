import { RequestType, Track, Lyrics, Node } from '@discordx/lava-player';
import { Queue, fromMS } from '@discordx/lava-queue';
import { Pagination, PaginationResolver } from '@discordx/pagination';
import { ActionRowBuilder, EmbedBuilder, Message } from 'discord.js';
import type {
	BaseMessageOptions,
	ButtonInteraction,
	CommandInteraction,
	MessageActionRowComponentBuilder,
	TextChannel,
} from 'discord.js';

import { LeaveButton } from '../../buttons/LeaveButton.js';
import { LoopButton } from '../../buttons/LoopButton.js';
import { LyricsButton } from '../../buttons/LyricsButton.js';
import { NextButton } from '../../buttons/NextButton.js';
import { PauseButton } from '../../buttons/PauseButton.js';
import { QueueButton } from '../../buttons/QueueButton.js';
import { RefreshControlsButton } from '../../buttons/RefreshControlsButton.js';
import { RepeatButton } from '../../buttons/RepeatButton.js';
import { ShuffleButton } from '../../buttons/ShuffleButton.js';

export class MusicQueue extends Queue {
	lastControlMessage?: Message;
	lockUpdate = false;

	channel?: TextChannel;

	constructor(node: Node, guildId: string) {
		super(node, guildId);
		setInterval(() => {
			this.updateControlMessage().catch((error: unknown) => {
				console.error(error);
			});
		}, 10_000);
	}

	async deleteMessage(message?: Message | null): Promise<void> {
		if (message?.deletable) {
			await message.delete().catch(() => null);
		}
	}

	async exit() {
		await super.exit();

		if (!this.channel) {
			return;
		}

		const message = await this.channel.send('>>> Se encontrou algum bug, reporte com o comando `/report`');

		setTimeout(() => void this.deleteMessage(message), 30_000);
	}

	private controlsRow(): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
		return [
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				LeaveButton.button(),
				PauseButton.button(this.isPlaying),
				NextButton.button(this.isPlaying),
				LyricsButton.button(),
				QueueButton.button(),
			),
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				RepeatButton.button(this.isPlaying, this.repeatMode),
				LoopButton.button(this.isPlaying, this.repeatMode),
				ShuffleButton.button(this.isPlaying),
				RefreshControlsButton.button(),
			),
		];
	}

	async updateControlMessage(options?: { force?: boolean; text?: string }): Promise<void> {
		if (this.lockUpdate || !this.channel) {
			return;
		}

		this.lockUpdate = true;

		if (!this.currentPlaybackTrack) {
			await this.deleteMessage(this.lastControlMessage);
			this.lastControlMessage = undefined;

			this.lockUpdate = false;
			return;
		}

		const embed = new EmbedBuilder().setTitle('Controles da música');

		if (this.currentPlaybackTrack.info.artworkUrl) {
			embed.setThumbnail(this.currentPlaybackTrack.info.artworkUrl);
		}

		embed.addFields({
			name: 'Tocando agora',
			value: this.getTrackTitle(this.currentPlaybackTrack),
			inline: true,
		});

		this.getProgressBar(embed);

		this.embedEmptyLine(embed);

		embed.addFields({
			name: 'Próxima música',
			value: this.nextTrack ? this.getTrackTitle(this.nextTrack) : 'Nenhuma',
		});

		this.getTotalMusicsInQueueText(embed);

		const messageOptions: BaseMessageOptions = {
			components: this.controlsRow(),
			content: options?.text,
			embeds: [embed],
		};

		if (this.lastControlMessage?.id !== this.channel.lastMessageId || options?.force) {
			await this.deleteMessage(this.lastControlMessage);
			this.lastControlMessage = undefined;

			const message = await this.channel.send(messageOptions).catch((error: unknown) => {
				console.error(error);
			});

			if (message) {
				this.lastControlMessage = message;
			}
		} else {
			await this.lastControlMessage.edit(messageOptions).catch((error: unknown) => {
				console.error(error);
			});
		}

		this.lockUpdate = false;
	}

	async view(interaction: ButtonInteraction | CommandInteraction): Promise<void> {
		if (!this.currentPlaybackTrack) {
			const message = await interaction.followUp({
				content: '> Não foi possível processar a fila, tente novamente mais tarde',
				ephemeral: true,
			});

			setTimeout(() => void this.deleteMessage(message), 3_000);
			return;
		}

		if (!this.size) {
			const message = await interaction.followUp({
				content: `> Tocando **${this.currentPlaybackTrack.info.title}**`,
				ephemeral: true,
			});

			setTimeout(() => void this.deleteMessage(message), 10_000);

			return;
		}

		if (this.size <= 10) {
			const message = await interaction.followUp({
				content: `> Tocando **${this.currentPlaybackTrack.info.title}**\n\n${this.tracks
					.map((track, index) => {
						const endTime = this.getEndTime(track);

						return `${index + 1}. ${this.getTrackTitle(track)} ${endTime ? `(${endTime})` : ''}`;
					})
					.join('\n\n')}`,
				ephemeral: true,
			});

			setTimeout(() => void this.deleteMessage(message), 10_000);

			return;
		}

		const pagesCount = Math.ceil(this.size / 10);

		const pageOptions = new PaginationResolver((index, paginator) => {
			paginator.maxLength = pagesCount;
			if (index > paginator.maxLength) {
				paginator.currentPage = 0;
			}

			const currentPage = paginator.currentPage;

			const queue = this.tracks
				.slice(currentPage * 10, currentPage * 10 + 10)
				.map((track, index) => {
					const endTime = this.getEndTime(track);

					console.log({
						message: `${currentPage * 10 + index + 1}. ${this.getTrackTitle(track)} ${endTime ? `(${endTime})` : ''}`,
					});

					return `${currentPage * 10 + index + 1}. ${this.getTrackTitle(track)} ${endTime ? `(${endTime})` : ''}`;
				})
				.join('\n\n');

			return {
				content: `> Tocando **${this.getTrackTitle(this.currentPlaybackTrack!)}** de ${
					this.size + 1
				} músicas\n\n${queue}`,
			};
		}, pagesCount);

		const pagination = new Pagination(interaction, pageOptions, {
			enableExit: true,
			onTimeout: (_, message) => void this.deleteMessage(message),
			time: 60_000,
			buttons: {
				previous: {
					label: 'Anterior',
				},
				next: {
					label: 'Próximo',
				},
				exit: {
					emoji: '',
					label: 'Fechar',
				},
			},
			selectMenu: {
				labels: {
					start: 'Primeira página',
					end: 'Última página',
				},
				pageText: 'Página {page}',
				rangePlaceholderFormat: '',
			},
		});

		await pagination.send();
	}

	getTrackTitle(track: null): null;
	getTrackTitle(track: Track): string;
	getTrackTitle(track: Track | null) {
		if (!track) {
			return null;
		}

		const title = track.info.title.length < 50 ? track.info.title : `${track.info.title.slice(0, 47)}...`;

		if (track.info.sourceName === 'flowery-tts') {
			return `Flowery TTS: ${title}`;
		}

		return `${track.info.author} - [${title}](<${track.info.uri}>)`;
	}

	private getEndTime(track: Track) {
		if (track.info.isStream) {
			return 'Livestream';
		}

		if (track.info.sourceName === 'flowery-tts') {
			return 'TTS';
		}

		return fromMS(track.info.length);
	}

	private getProgressBar(embed: EmbedBuilder): void {
		if (
			!this.currentPlaybackTrack ||
			this.currentPlaybackTrack.info.sourceName === 'flowery-tts' ||
			this.currentPlaybackTrack.info.isStream
		) {
			return;
		}

		const block = '━';
		const size = 15;

		const timeNow = this.currentPlaybackPosition;
		const timeTotal = this.currentPlaybackTrack.info.length;

		const progress = Math.round((size * timeNow) / timeTotal);

		const bar = `${this.isPlaying ? '▶️' : '⏸️'} ${block.repeat(progress)} 🔘 ${block.repeat(size - progress)}`;

		const currentTime = fromMS(timeNow);
		const endTime = fromMS(timeTotal);
		const spacing = bar.length - currentTime.length - endTime.length;

		embed.addFields({ name: bar, value: `\`${currentTime}${' '.repeat(spacing * 3 - 2)}${endTime}\`` });
	}

	/**
	 * Get the lyrics for the currently playing track.
	 *
	 * Requires [LavaLyrics](https://github.com/topi314/LavaLyrics) plugin and a supported
	 * [lyrics source](https://github.com/topi314/LavaLyrics?tab=readme-ov-file#supported-sources) plugin.
	 */
	getCurrentPlaybackLyrics(skipTrackSource = true): Promise<Lyrics | null> {
		const uri = `sessions/${this.sessionId}/players/${this.guildId}/track/lyrics?skipTrackSource=${String(skipTrackSource)}`;
		const url = this.http.url(uri);
		return this.http.request(RequestType.GET, url);
	}

	private getTotalMusicsInQueueText(embed: EmbedBuilder): void {
		if (!this.size) {
			return;
		}

		this.embedEmptyLine(embed);

		let totalTimeLeft = this.isSong(this.currentPlaybackTrack)
			? this.currentPlaybackTrack!.info.length - this.currentPlaybackPosition
			: 0;

		for (const track of this.tracks) {
			if (!this.isSong(track)) {
				continue;
			}

			totalTimeLeft += track.info.length;
		}

		embed.addFields(
			{
				name: 'Músicas na fila',
				value: this.size.toString(),
				inline: true,
			},
			{
				name: 'Tempo total da fila',
				value: fromMS(totalTimeLeft),
				inline: true,
			},
		);
	}

	private isSong(track: Track | null) {
		return track && !track.info.isStream && track.info.sourceName !== 'flowery-tts';
	}

	private embedEmptyLine(embed: EmbedBuilder) {
		embed.addFields({ name: ' \n \n ', value: ' \n \n ' });
	}
}
