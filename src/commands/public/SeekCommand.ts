import { ApplicationCommandOptionType } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Discord, SlashOption } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../../core/music/MusicPlayer.js';
import { SlashWithAliases } from '../../decorators/SlashWithAliases.js';
import { selfDestruct } from '../../utils/generalUtils.js';

@Discord()
@injectable()
export class SeekCommand {
	@SlashWithAliases({ name: 'seek', description: 'Toca a música a partir do segundo digitado' }, [
		'tocar-a-partir-de',
	])
	async seek(
		@SlashOption({
			name: 'seconds',
			nameLocalizations: { 'pt-BR': 'segundos' },
			description: 'The second the music should start playing',
			descriptionLocalizations: { 'pt-BR': 'O segundo que a música deve começar a tocar' },
			required: true,
			type: ApplicationCommandOptionType.Integer,
		})
		seconds: number,
		interaction: CommandInteraction,
	): Promise<void> {
		const cmd = await musicPlayer.parseCommand(interaction);
		if (!cmd) {
			return;
		}

		const { queue } = cmd;

		if (!queue.currentPlaybackTrack) {
			return selfDestruct({ interaction, followUp: '> Não tem nada tocando' });
		}

		if (!queue.currentPlaybackTrack.info.isSeekable) {
			return selfDestruct({ interaction, followUp: '> Não é possível alterar o tempo desse áudio.' });
		}

		if (seconds * 1000 > queue.currentPlaybackTrack.info.length) {
			return selfDestruct({ interaction, followUp: '> O tempo excede a duração da música' });
		}

		await queue.guildPlayer.update({ position: seconds * 1000 });

		return selfDestruct({ interaction, followUp: '> Pulado até o segundo requisitado' });
	}
}
