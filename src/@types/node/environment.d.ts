declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BOT_TOKEN: string;
			BOT_ID: string;

			ADMIN_USER_ID: string;

			ADMIN_SERVER_ID: string;
			READY_CHANNEL_ID: string;
			SERVERS_CHANNEL_ID: string;
			SERVERS_CONNECTED_CHANNEL_ID: string;
			REPORTS_CHANNEL_ID: string;

			LAVALINK_HOST: string;
			LAVALINK_PORT: number;
			OAUTH_REFRESH_TOKEN: string;

			SPOTIFY_CLIENT_ID: string;
			SPOTIFY_SECRET: string;
			SPOTIFY_DC_COOKIE: string;
		}
	}
}

export {};
