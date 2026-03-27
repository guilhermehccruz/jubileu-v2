import { DApplicationCommand } from 'discordx';
import { Client as ClientX } from 'discordx';

interface ApplicationCommandManagerInternal {
	getCommandsByGuild(): Promise<Map<string, DApplicationCommand[]>>;
	initGuildApplicationCommands(
		guildId: string,
		commands: DApplicationCommand[],
		retainDeleted: boolean,
	): Promise<void>;
	initGlobalApplicationCommands(retainDeleted: boolean): Promise<void>;
}

/**
 * Temporary class extension to make command `guildId` take priority over the client's `botGuilds`.
 *
 * That way a command can be restricted to a specific guild even when the client is started with
 * `botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)]` — just like the
 * `@Guild()` decorator works for admin commands.
 *
 * @todo This may be implemented in the base package in the future.
 */
export class Client extends ClientX {
	override async initApplicationCommands(retainDeleted = false): Promise<void> {
		const manager = this.applicationCommandManager as unknown as ApplicationCommandManagerInternal;
		const guildCommandStore = await manager.getCommandsByGuild();

		const guildPromises = Array.from(guildCommandStore.entries()).map(([guildId, commands]) => {
			const guild = this.guilds.cache.get(guildId);
			if (!guild) {
				return Promise.resolve();
			}

			/**
			 * Filter commands with specific guildIds
			 */
			const filteredCommands = commands.filter(
				(command) => command.guilds.length === 0 || command.guilds.includes(guildId),
			);

			return manager.initGuildApplicationCommands(guildId, filteredCommands, retainDeleted);
		});

		await Promise.all([Promise.all(guildPromises), manager.initGlobalApplicationCommands(retainDeleted)]);
	}
}
