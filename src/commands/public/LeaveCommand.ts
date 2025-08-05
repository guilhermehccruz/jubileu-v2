import type { CommandInteraction } from 'discord.js';
import { Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { SlashWithAliases } from '../../decorators/SlashWithAliases.js';
import { LeaveService } from '../../services/LeaveService.js';

@Discord()
@injectable()
export class LeaveCommand {
	constructor(private readonly leaveService: LeaveService) {}

	@SlashWithAliases(
		{
			name: 'leave',
			description: 'Leaves from the voice channel',
			descriptionLocalizations: { 'pt-BR': 'Sai do canal de voz' },
		},
		['sair'],
	)
	async leave(interaction: CommandInteraction): Promise<void> {
		await this.leaveService.execute(interaction);
	}
}
