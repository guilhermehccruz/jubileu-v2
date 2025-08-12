import z from 'zod';

z.object({
	BOT_TOKEN: z.string(),

	BOT_ID: z.string(),
	ADMIN_SERVER_ID: z.string(),
	READY_CHANNEL_ID: z.string(),
	SERVERS_CHANNEL_ID: z.string(),
	SERVERS_CONNECTED_CHANNEL_ID: z.string(),
	REPORTS_CHANNEL_ID: z.string(),
	ADMIN_USER_ID: z.string(),

	LAVALINK_HOST: z.string(),
	LAVALINK_PORT: z.coerce.number(),

	SPOTIFY_CLIENT_ID: z.string(),
	SPOTIFY_SECRET: z.string(),
	SPOTIFY_DC_COOKIE: z.string(),

	GENIUS_CLIENT_ID: z.string(),
	GENIUS_CLIENT_SECRET: z.string(),
	GENIUS_ACCESS_TOKEN: z.string(),

	PO_TOKEN: z.string(),
	VISITOR_DATA: z.string(),
	OAUTH_REFRESH_TOKEN: z.string(),
}).parse(process.env, { error: () => 'Invalid environment variable' });
