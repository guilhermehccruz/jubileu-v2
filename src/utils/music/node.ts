import type {
	VoiceServerUpdate,
	VoiceStateUpdate,
  } from "@discordx/lava-player";
import { Node } from '@discordx/lava-player';
import { GatewayDispatchEvents } from 'discord.js';
import type { Client } from 'discordx';

export function getLavaNode(client: Client): Node {
	const lavaNode = new Node({
		password: '',
		userId: client.user?.id ?? '',
		host: {
			address: process.env.LAVALINK_HOST,
			connectionOptions: { sessionId: client.botId },
			port: process.env.LAVALINK_PORT,
		},
		send(guildId, packet) {
			const guild = client.guilds.cache.get(guildId);

			if (guild) {
				guild.shard.send(packet);
			}
		},
	});

	client.ws.on(GatewayDispatchEvents.VoiceStateUpdate, (data: VoiceStateUpdate) => {
		lavaNode.voiceStateUpdate(data).catch((error) => console.error(error, client));
	});

	client.ws.on(GatewayDispatchEvents.VoiceServerUpdate, (data: VoiceServerUpdate) => {
		lavaNode.voiceServerUpdate(data).catch((error) => console.error(error));
	});

	return lavaNode;
}
