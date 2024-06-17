import { RequestType, Track, Lyrics } from '@discordx/lava-player';
import { Queue, QueueManager, RepeatMode, fromMS } from '@discordx/lava-queue';
import { Pagination, PaginationResolver, PaginationType } from '@discordx/pagination';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message } from 'discord.js';
import type {
	ButtonInteraction,
	CommandInteraction,
	MessageActionRowComponentBuilder,
	TextBasedChannel,
} from 'discord.js';

export class MusicQueue extends Queue {
	lastControlMessage?: Message;
	lockUpdate = false;

	channel?: TextBasedChannel;

	constructor(queueManager: QueueManager, guildId: string) {
		super(queueManager, guildId);
		setInterval(() => {
			this.updateControlMessage().catch((error: unknown) => {
				console.log(error);
			});
		}, 1e4);
	}

	private controlsRow(): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
		const nextButton = new ButtonBuilder()
			.setLabel('Próximo')
			.setEmoji('⏭')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(!this.isPlaying)
			.setCustomId('btn-next');

		const pauseButton = new ButtonBuilder()
			.setLabel(this.isPlaying ? 'Pausar' : 'Continuar')
			.setEmoji(this.isPlaying ? '⏸️' : '▶️')
			.setStyle(ButtonStyle.Primary)
			.setCustomId('btn-pause');

		const stopButton = new ButtonBuilder()
			.setLabel('Parar e sair')
			.setStyle(ButtonStyle.Danger)
			.setCustomId('btn-leave');

		const repeatButton = new ButtonBuilder()
			.setLabel('Repetir Música atual')
			.setEmoji('🔂')
			.setDisabled(!this.isPlaying)
			.setStyle(this.repeatMode === RepeatMode.REPEAT_ONE ? ButtonStyle.Danger : ButtonStyle.Primary)
			.setCustomId('btn-repeat');

		const loopButton = new ButtonBuilder()
			.setLabel('Loop na fila')
			.setEmoji('🔁')
			.setDisabled(!this.isPlaying)
			.setStyle(this.repeatMode === RepeatMode.REPEAT_ALL ? ButtonStyle.Danger : ButtonStyle.Primary)
			.setCustomId('btn-loop');

		const row1 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			stopButton,
			pauseButton,
			nextButton,
			repeatButton,
		);

		const queueButton = new ButtonBuilder()
			.setLabel('Fila')
			.setEmoji('🎵')
			.setStyle(ButtonStyle.Primary)
			.setCustomId('btn-queue');

		const mixButton = new ButtonBuilder()
			.setLabel('Aleatorizar')
			.setEmoji('🎛️')
			.setDisabled(!this.isPlaying)
			.setStyle(ButtonStyle.Primary)
			.setCustomId('btn-mix');

		const controlsButton = new ButtonBuilder()
			.setLabel('Atualizar controles')
			.setEmoji('🔄')
			.setStyle(ButtonStyle.Primary)
			.setCustomId('btn-controls');

		const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			loopButton,
			queueButton,
			mixButton,
			controlsButton,
		);
		return [row1, row2];
	}

	public async updateControlMessage(options?: { force?: boolean; text?: string }): Promise<void> {
		if (this.lockUpdate || !this.channel) {
			return;
		}

		this.lockUpdate = true;
		const embed = new EmbedBuilder();
		embed.setTitle('Controles da música');

		if (!this.currentPlaybackTrack) {
			if (this.lastControlMessage) {
				await this.lastControlMessage.delete().catch((error: unknown) => {
					console.error(error);
				});
				this.lastControlMessage = undefined;
			}

			this.lockUpdate = false;
			return;
		}

		embed.addFields({
			name: 'Agora tocando' + (this.size > 2 ? ` (Total: ${this.size} músicas na fila)` : ''),
			value: this.getTrackTitle(this.currentPlaybackTrack),
		});

		if (this.currentPlaybackTrack.info.artworkUrl) {
			embed.setThumbnail(this.currentPlaybackTrack.info.artworkUrl);
		}

		this.getProgressBar(embed);

		embed.addFields({
			name: 'Próxima música',
			value: this.nextTrack ? this.getTrackTitle(this.nextTrack) : 'Nenhuma',
		});

		const pMsg = {
			components: [...this.controlsRow()],
			content: options?.text,
			embeds: [embed],
		};

		if (!this.lastControlMessage || this.lastControlMessage.id !== this.channel.lastMessageId || options?.force) {
			if (this.lastControlMessage) {
				await this.lastControlMessage.delete().catch((error: unknown) => {
					console.error(error);
				});
				this.lastControlMessage = undefined;
			}

			const msg = await this.channel.send(pMsg).catch((error: unknown) => {
				console.error(error);
			});
			if (msg) {
				this.lastControlMessage = msg;
			}
		} else {
			await this.lastControlMessage.edit(pMsg).catch((error: unknown) => {
				console.error(error);
			});
		}

		this.lockUpdate = false;
	}

	public async view(interaction: ButtonInteraction | CommandInteraction): Promise<void> {
		if (!this.currentPlaybackTrack) {
			const pMsg = await interaction.followUp({
				content: '> Não foi possível processar a fila, tente novamente mais tarde',
				ephemeral: true,
			});

			if (pMsg instanceof Message) {
				setTimeout(() => {
					pMsg.delete().catch((error: unknown) => {
						console.error(error);
					});
				}, 3000);
			}
			return;
		}

		if (!this.size) {
			const pMsg = await interaction.followUp({
				content: `> Tocando **${this.currentPlaybackTrack.info.title}**`,
				ephemeral: true,
			});
			if (pMsg instanceof Message) {
				setTimeout(() => {
					pMsg.delete().catch((error: unknown) => {
						console.error(error);
					});
				}, 1e4);
			}
			return;
		}

		const pageOptions = new PaginationResolver(
			(index, paginator) => {
				paginator.maxLength = this.size / 10;
				if (index > paginator.maxLength) {
					paginator.currentPage = 0;
				}

				const currentPage = paginator.currentPage;

				const queue = this.tracks
					.slice(currentPage * 10, currentPage * 10 + 10)
					.map((track, index) => {
						const endTime = this.getEndTime(track);

						return `${currentPage * 10 + index + 1}. ${this.getTrackTitle(track)} ${endTime ? `(${endTime})` : ''}`;
					})
					.join('\n\n');

				return {
					content: `> Tocando **${this.getTrackTitle(this.currentPlaybackTrack!)}** de ${
						this.size + 1
					} músicas\n\n${queue}`,
				};
			},
			Math.round(this.size / 10),
		);

		const pagination = new Pagination(interaction, pageOptions, {
			enableExit: true,
			onTimeout: (_, message) => {
				if (message.deletable) {
					message.delete().catch((error: unknown) => {
						console.error(error);
					});
				}
			},
			time: 6e4,
			type: Math.round(this.size / 10) <= 5 ? PaginationType.Button : PaginationType.SelectMenu,
			start: { label: 'Início' },
			previous: { label: 'Anterior' },
			next: { label: 'Próximo' },
			end: { label: 'Fim' },
			exit: { label: 'Fechar' },
		});

		await pagination.send();
	}

	async exit(): Promise<void> {
		await super.exit();
	}

	getTrackTitle(track: Track): string {
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
	public getCurrentPlaybackLyrics(skipTrackSource = true): Promise<Lyrics | null> {
		const uri = `sessions/${this.sessionId}/players/${this.guildId}/track/lyrics?skipTrackSource=${String(skipTrackSource)}`;
		const url = this.http.url(uri);
		return this.http.request(RequestType.GET, url);
	}

	/**
	 * Get the lyrics for the track.
	 *
	 * Requires [LavaLyrics](https://github.com/topi314/LavaLyrics) plugin and a supported
	 * [lyrics source](https://github.com/topi314/LavaLyrics?tab=readme-ov-file#supported-sources) plugin.
	 */
	public getLyrics(encodedTrack: string, skipTrackSource = true): Promise<Lyrics | null> {
		const uri = `lyrics?track=${encodeURIComponent(encodedTrack)}&skipTrackSource=${String(skipTrackSource)}`;
		const url = this.http.url(uri);
		return this.http.request(RequestType.GET, url);
	}
}
