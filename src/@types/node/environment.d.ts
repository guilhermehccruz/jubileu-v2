declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BOT_TOKEN: string;

			BOT_ID: string;
			ADMIN_SERVER_ID: string;
			READY_CHANNEL_ID: string;
			SERVERS_CHANNEL_ID: string;
			SERVERS_CONNECTED_CHANNEL_ID: string;
			REPORTS_CHANNEL_ID: string;
			ADMIN_USER_ID: string;

			LAVALINK_HOST: string;
			LAVALINK_PORT: number;

			SPOTIFY_CLIENT_ID: string;
			SPOTIFY_SECRET: string;
			SPOTIFY_DC_COOKIE: string;

			GENIUS_CLIENT_ID: string;
			GENIUS_CLIENT_SECRET: string;
			GENIUS_ACCESS_TOKEN: string;

			PO_TOKEN: string;
			VISITOR_DATA: string;
			OAUTH_REFRESH_TOKEN: string;
		}
	}
}

export {};
