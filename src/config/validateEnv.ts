import z from 'zod';

z.object({
	BOT_TOKEN: z.string(),
	BOT_ID: z.string(),

	ADMIN_USER_ID: z.string(),

	ADMIN_SERVER_ID: z.string(),
	READY_CHANNEL_ID: z.string(),
	SERVERS_CHANNEL_ID: z.string(),
	SERVERS_CONNECTED_CHANNEL_ID: z.string(),
	REPORTS_CHANNEL_ID: z.string(),

	LAVALINK_HOST: z.string(),
	LAVALINK_PORT: z.coerce.number(),
	OAUTH_REFRESH_TOKEN: z.string(),

	SPOTIFY_CLIENT_ID: z.string(),
	SPOTIFY_SECRET: z.string(),
	SPOTIFY_DC_COOKIE: z.string(),
}).parse(process.env, { error: () => 'Invalid environment variable' });
