import { ApplicationCommandOptionType, CommandInteraction, MessageFlags } from 'discord.js';
import { Client, Discord, Slash, SlashOption } from 'discordx';
import { injectable } from 'tsyringe';

import { Admin } from '../../decorators/AdminGuard.js';

@Discord()
@injectable()
export class ServersCommand {
	@Admin()
	@Slash({
		name: 'leave-server',
		description: 'Leave Server',
	})
	async servers(
		@SlashOption({
			name: 'server-id',
			description: 'server id',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		serverId: string,
		interaction: CommandInteraction,
		client: Client,
	): Promise<void> {
		if (!interaction.deferred) {
			await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		}

		const server = client.guilds.cache.get(serverId);

		if (!server) {
			await interaction.followUp({ content: 'Server not found' });
			return;
		}

		await server.leave();

		await interaction.followUp({ content: `Saí do servidor "${server.name}"` });
	}
}
