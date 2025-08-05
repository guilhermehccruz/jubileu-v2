import { EmbedBuilder } from 'discord.js';
import type { TextChannel } from 'discord.js';
import { Discord, On, type ArgsOf, type Client } from 'discordx';
import { injectable } from 'tsyringe';

@Discord()
@injectable()
export class VoiceStateUpdateEvent {
	private activeVoices: string[] = [];

	@On({ event: 'voiceStateUpdate' })
	async voiceServerUpdate([, newState]: ArgsOf<'voiceStateUpdate'>, client: Client): Promise<void> {
		if (newState.member?.id !== process.env.BOT_ID) {
			return;
		}

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
		)) as TextChannel;

		await connectedToChannel.send({
			embeds: [
				new EmbedBuilder()
					.setTitle('Servidores que estou atualmente conectado a um canal de voz')
					.setDescription(this.activeVoices.join('\n') || ' '),
			],
		});
	}
}
