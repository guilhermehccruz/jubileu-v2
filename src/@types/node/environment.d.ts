/* eslint-disable @typescript-eslint/naming-convention */
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BOT_TOKEN: string;

			READY_CHANNEL_ID?: string;
			SERVERS_CHANNEL_ID?: string;

			LAVA_HOST: string;
			LAVA_PORT: number;
			LAVA_PASSWORD: string;

			SPOTIFY_CLIENT_ID: string;
			SPOTIFY_SECRET: string;
		}
	}
}

export {};
