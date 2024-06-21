import { EmbedBuilder, type TextBasedChannel } from 'discord.js';
import { Discord, On, type ArgsOf, type Client } from 'discordx';
import { injectable } from 'tsyringe';

@Discord()
@injectable()
export class VoiceStateUpdate {
	private activeVoices: string[] = [];

	@On({ event: 'voiceStateUpdate' })
	async voiceServerUpdate([, newState]: ArgsOf<'voiceStateUpdate'>, client: Client): Promise<void> {
		if (newState.channelId && !this.activeVoices.includes(newState.guild.name)) {
			this.activeVoices.push(newState.guild.name);

			await this.sendServersConnectedToMessage(client);
		} else if (!newState.channelId && this.activeVoices.includes(newState.guild.name)) {
			this.activeVoices.splice(this.activeVoices.indexOf(newState.guild.name), 1);

			await this.sendServersConnectedToMessage(client);
		}
	}

	private async sendServersConnectedToMessage(client: Client) {
		const connectedToChannel = (await client.channels.fetch(
			process.env.SERVERS_CONNECTED_CHANNEL_ID,
		)) as TextBasedChannel;

		await connectedToChannel.send({
			embeds: [
				new EmbedBuilder()
					.setTitle('Servidores que estou atualmente conectado a um canal de voz')
					.setDescription(this.activeVoices.join('\n') || ' '),
			],
		});
	}
}
