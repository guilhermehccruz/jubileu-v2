import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { Client, Discord, Slash, SlashOption } from 'discordx';
import { injectable } from 'tsyringe';

import { Admin } from '../../decorators/AdminGuard.js';
import { selfDestruct } from '../../utils/generalUtils.js';

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
		const server = client.guilds.cache.get(serverId);

		if (!server) {
			return selfDestruct({ interaction, followUp: 'Server not found' });
		}

		await server.leave();

		return selfDestruct({ interaction, followUp: `Saí do servidor "${server.name}"` });
	}
}
