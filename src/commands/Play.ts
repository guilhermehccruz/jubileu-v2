import type { TrackResponse } from '@discordx/lava-player';
import { LoadType, Status } from '@discordx/lava-player';
import type { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { Client } from 'discordx';
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx';
import { inject, injectable } from 'tsyringe';

import { MusicPlayer } from '../utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class Play {
	constructor(
		@inject(MusicPlayer)
		private musicPlayer: MusicPlayer
	) {}

	@Slash({ description: 'Toca o audio do link enviado ou procura no youtube o que foi digitado' })
	async play(
		@SlashChoice('LINK', 'PROCURAR')
		@SlashOption({ name: 'tipo', type: ApplicationCommandOptionType.String })
		type: 'LINK' | 'PROCURAR',
		@SlashOption({ name: 'pesquisa', type: ApplicationCommandOptionType.String })
		input: string,
		interaction: CommandInteraction,
		client: Client
	): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction, true);
		if (!cmd) {
			return;
		}

		const { queue, member, channel } = cmd;

		let response: TrackResponse;

		if (type === 'LINK') {
			response = await queue.enqueue(input);

			if (!response.tracks[0]) {
				await interaction.followUp('> Não encontramos nada com o que foi enviado');
				return;
			}
		} else {
			const searchResponse = await queue.search(input);

			if (!searchResponse.tracks[0]) {
				await interaction.followUp('> Não encontramos nada com o que foi enviado');
				return;
			}

			const track = searchResponse.tracks[0];

			queue.tracks.push(track);
			response = {
				loadType: LoadType.TRACK_LOADED,
				playlistInfo: {},
				tracks: [track],
			};
		}

		await queue.lavaPlayer.join(member.voice.channelId, {
			deaf: true,
		});

		queue.channel = channel;

		if (
			queue.lavaPlayer.status === Status.INSTANTIATED ||
			queue.lavaPlayer.status === Status.UNKNOWN ||
			queue.lavaPlayer.status === Status.ENDED
		) {
			queue.playNext();
		}

		const embed = new EmbedBuilder();
		embed.setTitle('Adicionado a fila');
		if (response.playlistInfo.name) {
			embed.setDescription(`${response.tracks.length} de ${response.playlistInfo.name}`);
		} else if (response.tracks.length === 1) {
			embed.setDescription(`[${response.tracks[0]?.info.title}](<${response.tracks[0]?.info.uri}>)`);
		} else {
			embed.setDescription(`${response.tracks.length}`);
		}

		await interaction.followUp({ embeds: [embed] });
		return;
	}
}
