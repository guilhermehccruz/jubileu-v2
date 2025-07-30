import { SlashCommandBuilder } from 'discord.js';
import { ApplicationCommandOptions, MethodDecoratorEx, Slash } from 'discordx';

export function SlashWithAliases<T extends Lowercase<string>>(
	command: ApplicationCommandOptions<T, string> | SlashCommandBuilder,
	aliases: T[],
): MethodDecoratorEx {
	return function (target: Record<string, string>, propertyKey: string, descriptor: PropertyDescriptor): void {
		const allNames = [command.name, ...aliases];

		for (const name of allNames) {
			if (command instanceof SlashCommandBuilder) {
				if (name) {
					command.setName(name);
				}

				Slash(command)(target, propertyKey, descriptor);

				continue;
			}

			Slash({ ...command, name: name as Lowercase<string> })(target, propertyKey, descriptor);
		}
	};
}
