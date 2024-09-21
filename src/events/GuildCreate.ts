import { EmbedBuilder } from 'discord.js';
import type { TextChannel } from 'discord.js';
import { Discord, On } from 'discordx';
import type { ArgsOf, Client } from 'discordx';

@Discord()
export class GuildCreate {
	@On({ event: 'guildCreate' })
	async guildCreate([guild]: ArgsOf<'guildCreate'>, client: Client): Promise<void> {
		// Synchronize applications commands with Discord
		await client.initApplicationCommands();

		const serversChannel = client.channels.cache.get(process.env.SERVERS_CHANNEL_ID) as TextChannel;

		await serversChannel.send({
			embeds: [
				new EmbedBuilder().setTitle('Entrei em um servidor').setDescription(`Servidor: ${guild.name}`),
				new EmbedBuilder()
					.setTitle('Lista de servidores atualizada')
					.setDescription(client.guilds.cache.map((server) => server.name).join('\n')),
			],
		});
	}
}
