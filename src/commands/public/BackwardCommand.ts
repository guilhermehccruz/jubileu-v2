import { ApplicationCommandOptionType } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Discord, SlashChoice, SlashOption } from 'discordx';
import { injectable } from 'tsyringe';

import { musicPlayer } from '../../core/music/MusicPlayer.js';
import { SlashWithAliases } from '../../decorators/SlashWithAliases.js';
import { selfDestruct } from '../../utils/generalUtils.js';

@Discord()
@injectable()
export class BackwardCommand {
	@SlashWithAliases({ name: 'backward', description: 'Volta uma quantidade especifica de segundos na música' }, [
		'voltar',
	])
	async backward(
		@SlashChoice({ name: '15', value: 15 })
		@SlashChoice({ name: '30', value: 30 })
		@SlashChoice({ name: '45', value: 45 })
		@SlashChoice({ name: '60', value: 60 })
		@SlashChoice({ name: '90', value: 90 })
		@SlashChoice({ name: '120', value: 120 })
		@SlashOption({
			name: 'seconds',
			nameLocalizations: { 'pt-BR': 'segundos' },
			description: 'The amount of seconds to backward',
			descriptionLocalizations: { 'pt-BR': 'A quantidade de segundos que deve voltar' },
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

		seconds * 1000 < 0
			? await queue.guildPlayer.update({ position: 0 })
			: await queue.guildPlayer.update({ position: queue.currentPlaybackPosition - seconds * 1000 });

		await selfDestruct({ interaction, followUp: '> Voltado o tempo requisitado' });

		await queue.updateControlMessage({ force: true });
	}
}
