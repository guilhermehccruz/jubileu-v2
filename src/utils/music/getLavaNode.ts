import { Node, VoiceServerUpdate, VoiceStateUpdate } from '@discordx/lava-player';
import { GatewayDispatchEvents } from 'discord.js';
import type { Client } from 'discordx';

export function getLavaNode(client: Client): Node {
	const lavaNode = new Node({
		password: process.env.LAVA_PASSWORD,
		userId: client.user?.id ?? '',
		host: {
			address: process.env.LAVA_HOST,
			connectionOptions: { resumeKey: client.botId, resumeTimeout: 15 },
			port: process.env.LAVA_PORT,
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
