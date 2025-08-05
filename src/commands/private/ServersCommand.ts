import { CommandInteraction, EmbedBuilder, OAuth2Guild } from 'discord.js';
import { Client, Discord, Slash } from 'discordx';
import { injectable } from 'tsyringe';

import { Admin } from '../../decorators/AdminGuard.js';

@Discord()
@injectable()
export class ServersCommand {
	@Admin()
	@Slash({
		name: 'servers',
		description: 'Bot servers',
	})
	async servers(interaction: CommandInteraction, client: Client): Promise<void> {
		if (!interaction.deferred) {
			await interaction.deferReply();
		}

		const servers = await client.guilds.fetch();

		const embeds: EmbedBuilder[] = [];

		await Promise.allSettled(servers.map((server) => this.getGuildEmbed(embeds, server)));

		await interaction.followUp({ embeds, ephemeral: true });
	}

	private async getGuildEmbed(embeds: EmbedBuilder[], server: OAuth2Guild) {
		const guild = await server.fetch();

		const owner = guild.members.cache.get(guild.ownerId) ?? (await guild.members.fetch(guild.ownerId));

		const embed = new EmbedBuilder()
			.setTitle(guild.name)
			.setThumbnail(guild.iconURL({ forceStatic: true, size: 128 }))
			.addFields(
				{ name: 'Dono', value: owner.displayName },
				{
					name: 'Membros',
					value: guild.memberCount.toString(),
					inline: true,
				},
			);

		embeds.push(embed);
	}
}
