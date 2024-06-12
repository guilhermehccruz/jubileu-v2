import { LoadType } from '@discordx/lava-player';
import type { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { Client, Discord, Slash, SlashChoice, SlashOption } from 'discordx';
import { injectable } from 'tsyringe';

import { MusicPlayer } from '@/utils/music/MusicPlayer.js';

@Discord()
@injectable()
export class Play {
	constructor(private readonly musicPlayer: MusicPlayer) {}

	/**
	 *
	 * Links podem ser de:
	 *
	 * Youtube, Soundcloud, Spotify, Apple Music, Bandcamp, Vimeo e Twitch
	 *
	 */
	@Slash({ description: 'Toca o audio do link enviado ou procura o que foi digitado.' })
	async play(
		@SlashOption({
			name: 'pesquisa',
			description: 'O que o bot deve pesquisar',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		input: string,

		@SlashChoice({ name: 'Youtube', value: 'ytsearch' })
		@SlashChoice({ name: 'Youtube Music', value: 'ytmsearch' })
		@SlashChoice({ name: 'Sound Cloud', value: 'scsearch' })
		@SlashChoice({ name: 'Spotify', value: 'spsearch' })
		@SlashChoice({ name: 'Flowery TTS', value: 'ftts' })
		@SlashOption({
			name: 'onde-buscar',
			description: 'Em que plataforma o bot deve pesquisar',
			type: ApplicationCommandOptionType.String,
		})
		platform: 'ytsearch' | 'ytmsearch' | 'scsearch' | 'spsearch' | 'ftts' = 'ytsearch',

		interaction: CommandInteraction,
		client: Client,
	): Promise<void> {
		const cmd = await this.musicPlayer.ParseCommand(client, interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		if (!input.startsWith('http://') && !input.startsWith('https://')) {
			if (platform === 'ftts') {
				input = `ftts://${encodeURIComponent(input)}`;
			} else {
				input = `${platform}:${input}`;
			}
		}

		const { loadType, data } = await queue.search(input);

		if (loadType === LoadType.ERROR) {
			await interaction.followUp({
				content: `> Ocorreu um erro: ${data.cause}`,
			});
			return;
		}

		if (loadType === LoadType.EMPTY) {
			await interaction.followUp({
				content: '> Não encontramos nada com o identificador utilizado',
			});
			return;
		}

		const embed = new EmbedBuilder();
		embed.setTitle('Adicionado a fila');

		if (loadType === LoadType.TRACK || loadType === LoadType.SEARCH) {
			const track = loadType === LoadType.SEARCH ? data[0] : data;

			queue.addTrack(track);

			embed.setDescription(queue.getTrackTitle(track));

			if (track.info.artworkUrl) {
				embed.setThumbnail(track.info.artworkUrl);
			}
		} else {
			queue.addTrack(...data.tracks);

			embed.setDescription(`${data.tracks.length} da playlist ${data.info.name}`);
		}

		await interaction.followUp({ embeds: [embed] });

		if (!queue.isPlaying) {
			await queue.playNext();
		}

		await queue.updateControlMessage();
	}
}
