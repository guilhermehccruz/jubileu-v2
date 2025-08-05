import { CommandInteraction } from 'discord.js';
import { GuardFunction, Guard, ClassMethodDecorator, Guild } from 'discordx';

/**
 * Marks a class or method as usable only by an admin user in an admin server
 */
export function Admin(): ClassMethodDecorator {
	return function <T>(
		target: Record<string, string>,
		propertyKey?: string,
		descriptor?: TypedPropertyDescriptor<T>,
	): void {
		Guard(isAdmin)(target, propertyKey, descriptor);
		Guild(process.env.ADMIN_SERVER_ID)(target, propertyKey, descriptor);
	};
}

const isAdmin: GuardFunction<CommandInteraction> = async (interaction, client, next) => {
	if (interaction.user.id !== process.env.ADMIN_USER_ID) {
		if (!interaction.deferred) {
			await interaction.deferReply();
		}

		await interaction.followUp({ content: 'Permissão insuficiente', ephemeral: true });

		return;
	}

	await next();
};
