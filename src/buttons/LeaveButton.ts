import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonComponent, Discord } from 'discordx';
import { injectable } from 'tsyringe';

import { LeaveService } from '../services/LeaveService.js';

@Discord()
@injectable()
export class LeaveButton {
	constructor(private readonly leaveService: LeaveService) {}

	@ButtonComponent({ id: 'btn-leave' })
	async button(interaction: ButtonInteraction): Promise<void> {
		await this.leaveService.leave(interaction);
	}

	static button() {
		return new ButtonBuilder()
			.setLabel('Sair')
			.setEmoji('⏹️')
			.setStyle(ButtonStyle.Danger)
			.setCustomId('btn-leave');
	}
}
