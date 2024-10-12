import type { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { injectable } from 'tsyringe';

import { LeaveService } from '../services/LeaveService.js';

@Discord()
@injectable()
export class LeaveCommand {
	constructor(private readonly leaveService: LeaveService) {}

	@Slash({ description: 'Sai do canal conectado' })
	async leave(interaction: CommandInteraction): Promise<void> {
		await this.leaveService.leave(interaction);
	}
}
