import { EmbedBuilder } from 'discord.js';
import type { TextChannel } from 'discord.js';
import { On, Discord } from 'discordx';
import type { ArgsOf, Client } from 'discordx';

@Discord()
export class GuildDelete {
	@On({ event: 'guildDelete' })
	async guildDelete([guild]: ArgsOf<'guildDelete'>, client: Client): Promise<void> {
		const serversChannel = client.channels.cache.get(process.env.SERVERS_CHANNEL_ID) as TextChannel;

		await serversChannel.send({
			embeds: [
				new EmbedBuilder().setTitle('Saí de um servidor').setDescription(`Servidor: ${guild.name}`),
				new EmbedBuilder()
					.setTitle('Lista de servidores atualizada')
					.setDescription(client.guilds.cache.map((server) => server.name).join('\n')),
			],
		});
	}
}
