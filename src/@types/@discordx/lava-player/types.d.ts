export module '@discordx/lava-player' {
	export interface LyricsLine {
		/**
		 * The duration of the line in milliseconds
		 */
		duration: number | null;
		/**
		 * The lyrics line
		 */
		line: string;
		/**
		 * Additional plugin specific data
		 */
		plugin: unknown;
		/**
		 * The timestamp of the line in milliseconds
		 */
		timestamp: number;
	}

	export interface Lyrics {
		/**
		 * The lyrics lines
		 */
		lines: LyricsLine[];
		/**
		 * Additional plugin specific data
		 */
		plugin: unknown;
		/**
		 * The name of the provider the lyrics was fetched from on the source
		 */
		provider: string;
		/**
		 * The name of the source where the lyrics were fetched from
		 */
		sourceName: string;
		/**
		 * The lyrics text
		 */
		text: string | null;
	}
}
