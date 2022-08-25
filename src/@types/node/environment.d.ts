/* eslint-disable @typescript-eslint/naming-convention */
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BOT_TOKEN: string;
			JUBILEU_GUILD_ID: string;
			PWD: string;
			JUBILEU_ID: string;
			ADM_ROLE_ID: string;
			READY_CHANNEL_ID: string;
			SERVERS_CHANNEL_ID: string;
			ERROR_CHANNEL_ID: string;
			LOG_CHANNEL_ID: string;
			LAVA_HOST: string;
			LAVA_PORT: number;
		}
	}
}

export {};
