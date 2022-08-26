import { EmbedBuilder } from 'discord.js';
import { Discord, On } from 'discordx';
import type { ArgsOf, Client } from 'discordx';

@Discord()
export class GuildCreate {
	@On({ event: 'guildCreate' })
	async guildCreate([guild]: ArgsOf<'guildCreate'>, client: Client): Promise<void> {
		if (process.env.SERVERS_CHANNEL_ID) {
			const serversChannel = client.channels.cache.get(process.env.SERVERS_CHANNEL_ID);

			const newServerEmbed = new EmbedBuilder()
				.setTitle('Entrei em um servidor')
				.setDescription(`Servidor: ${guild.name}`);

			const updatedServersEmbed = new EmbedBuilder()
				.setTitle('Lista de servidores atualizada')
				.setDescription(client.guilds.cache.map((server) => server.name).join('\n'));

			if (serversChannel?.isTextBased()) {
				await serversChannel.send({ embeds: [newServerEmbed, updatedServersEmbed] });
			}
		}
	}
}
