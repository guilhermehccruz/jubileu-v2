import { Client as ClientX } from 'discordx';

//* Temporary class extension, this may be implemented in the base package
export class Client extends ClientX {
	override async initApplicationCommands(retainDeleted = false): Promise<void> {
		const allGuildPromises: Promise<void>[] = [];
		const guildDCommandStore = await this.CommandByGuild();

		// run task to add/update/delete slashes for guilds
		guildDCommandStore.forEach((DCommands, guildId) => {
			// If bot is not in guild, skip it
			const guild = this.guilds.cache.get(guildId);
			if (!guild) {
				return;
			}

			/**
			 * Filter commands with specific guildIds
			 */
			const filetedDCommands = DCommands.filter(
				(command) => command.guilds.length === 0 || command.guilds.includes(guildId),
			);

			allGuildPromises.push(this.initGuildApplicationCommands(guildId, filetedDCommands, retainDeleted));
		});

		await Promise.all([Promise.all(allGuildPromises), this.initGlobalApplicationCommands(retainDeleted)]);
	}
}
