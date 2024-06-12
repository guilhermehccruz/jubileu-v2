import { PlayerStatus, Track } from '@discordx/lava-player';
import type { Player } from '@discordx/lava-queue';
import { Queue, RepeatMode, fromMS } from '@discordx/lava-queue';
import { Pagination, PaginationResolver, PaginationType } from '@discordx/pagination';
import type {
	ButtonInteraction,
	CommandInteraction,
	MessageActionRowComponentBuilder,
	TextBasedChannel,
} from 'discord.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message } from 'discord.js';

export class MusicQueue extends Queue {
	lastControlMessage?: Message;
	lockUpdate = false;

	channel?: TextBasedChannel;

	get isPlaying(): boolean {
		return (
			this.currentPlaybackTrack !== null &&
			this.lavaPlayer.status === PlayerStatus.PLAYING
		);
	}

	get isControlLastMessage(): boolean {
		return this.lastControlMessage?.id === this.channel?.lastMessageId;
	}

	override get tracks(): Track[] {
		// @ts-expect-error override to be able to change the queue
		return this._tracks;
	}

	constructor(player: Player, guildId: string) {
		super(player, guildId);
		setInterval(() => {
			this.updateControlMessage().catch((error) => console.log(error));
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
			repeatButton
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
			controlsButton
		);
		return [row1, row2];
	}

	public async updateControlMessage(options?: { force?: boolean; text?: string }): Promise<void> {
		if (this.lockUpdate || this.channel === null) {
			return;
		}

		this.lockUpdate = true;
		const embed = new EmbedBuilder();
		embed.setTitle('Controles da música');

		if (!this.currentPlaybackTrack) {
			if (this.lastControlMessage) {
				await this.lastControlMessage.delete().catch((error) => console.error(error));
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

		if (!this.lastControlMessage || !this.isControlLastMessage || options?.force) {
			if (this.lastControlMessage) {
				await this.lastControlMessage.delete().catch((error) => console.error(error));
				this.lastControlMessage = undefined;
			}

			const msg = await this.channel?.send(pMsg).catch((error) => console.error(error));
			if (msg) {
				this.lastControlMessage = msg;
			}
		} else {
			await this.lastControlMessage.edit(pMsg).catch((error) => console.error(error));
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
					pMsg.delete().catch((error) => console.error(error));
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
					pMsg.delete().catch((error) => console.error(error));
				}, 1e4);
			}
			return;
		}

		const pageOptions = new PaginationResolver((index, paginator) => {
			paginator.maxLength = this.size / 10;
			if (index > paginator.maxLength) {
				paginator.currentPage = 0;
			}

			const currentPage = paginator.currentPage;

			const queue = this.tracks
				.slice(currentPage * 10, currentPage * 10 + 10)
				.map((track, index) => {
					const endTime = this.getEndTime(track);

					return `${currentPage * 10 + index + 1}. ${this.getTrackTitle(track)} ${endTime ? `(${endTime})` : ''}`

				})
				.join('\n\n');

			return {
				content: `> Tocando **${this.getTrackTitle(this.currentPlaybackTrack!)}** de ${this.size + 1
					} músicas\n\n${queue}`
			};
		}, Math.round(this.size / 10));

		const pagination = new Pagination(interaction, pageOptions, {
			enableExit: true,
			onTimeout: async (_, message) => {
				if (message.deletable) {
					await message.delete().catch((error) => console.error(error));
				}
			},
			time: 6e4,
			type: Math.round(this.size / 10) <= 5 ? PaginationType.Button : PaginationType.SelectMenu,
			start: { label: 'Início' },
			previous: { label: 'Anterior' },
			next: { label: 'Próximo' },
			end: { label: 'Fim' },
			exit: { label: 'Fechar' },
		})

		await pagination.send();
	}

	async exit(): Promise<void> {
		await super.exit();
	}

	getTrackTitle(track: Track): string {
		const title = track.info.title.length < 50 ? track.info.title : `${track.info.title.slice(0, 47)}...`

		if (track.info.sourceName === 'flowery-tts') {
			return `Flowery TTS: ${title}`;
		}

		return `${track.info.author} - [${title}](<${track.info.uri}>)`
	}

	private getEndTime(track: Track) {
		if (track.info.isStream) {
			return 'Livestream'
		}

		if (track.info.sourceName === 'flowery-tts') {
			return 'TTS';
		}

		return fromMS(track.info.length)
	}

	private getProgressBar(embed: EmbedBuilder): void {
		if (!this.currentPlaybackTrack ||
			this.currentPlaybackTrack?.info.sourceName === 'flowery-tts' ||
			this.currentPlaybackTrack.info.isStream
		) {
			return;
		}

		const arrow = '🔘';
		const block = '━';
		const size = 15;

		const timeNow = this.currentPlaybackPosition;
		const timeTotal = this.currentPlaybackTrack!.info?.length;

		const tempProgress = Math.round((size * timeNow) / timeTotal);
		const progress = tempProgress <= 15 ? tempProgress : 15;
		const emptyProgress = size - (Number.isFinite(progress) ? progress : 0);

		const progressString = block.repeat(progress) + arrow + block.repeat(emptyProgress);

		const bar = (this.isPlaying ? '▶️' : '⏸️') + ' ' + progressString;
		const currentTime = fromMS(timeNow);

		let endTime: string;
		let spacing: number;

		endTime = fromMS(timeTotal);
		spacing = bar.length - currentTime.length - endTime.length;


		const time = '`' + currentTime + ' '.repeat(spacing * 3 - 2) + endTime + '`';

		embed.addFields({ name: bar, value: time });
	}
}
