import { LoadType } from '@discordx/lava-player';
import type { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { Discord, SlashChoice, SlashOption } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../../core/music/MusicPlayer.js';
import { SlashWithAliases } from '../../decorators/SlashWithAliases.js';
import { selfDestruct } from '../../utils/generalUtils.js';

@Discord()
@injectable()
export class PlayCommand {
	/**
	 *
	 * Links podem ser de:
	 *
	 * Youtube, Soundcloud, Spotify, Bandcamp, Vimeo e Twitch
	 *
	 */
	@SlashWithAliases(
		{
			name: 'play',
			description: 'Play the song from the provided link or search based on the input',
			descriptionLocalizations: {
				'pt-BR': 'Toca a partir do link enviado ou procura o que foi digitado',
			},
		},
		['tocar'],
	)
	async play(
		@SlashOption({
			name: 'input',
			nameLocalizations: { 'pt-BR': 'pesquisa' },
			description: 'What should be played',
			descriptionLocalizations: { 'pt-BR': 'O que deve tocar' },
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
	): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		if (!input.startsWith('http://') && !input.startsWith('https://')) {
			input =
				platform === 'ftts' ? `ftts://${encodeURIComponent(input).slice(0, 2_000)}` : `${platform}:${input}`;
		}

		const { loadType, data } = await queue.search(input);

		if (loadType === LoadType.ERROR) {
			return selfDestruct({ interaction, followUp: `> Ocorreu um erro: ${data.cause}` });
		}

		if (loadType === LoadType.EMPTY) {
			return selfDestruct({ interaction, followUp: '> Não encontramos nada com o identificador utilizado' });
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

		await selfDestruct({
			interaction,
			followUp: {
				embeds: [embed],
			},
		});

		if (!queue.currentPlaybackTrack) {
			await queue.playNext();
		}

		await queue.updateControlMessage();
	}
}
