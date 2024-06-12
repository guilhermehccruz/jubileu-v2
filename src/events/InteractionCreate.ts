import { On, Discord } from 'discordx';
import type { ArgsOf, Client } from 'discordx';

@Discord()
export class InteractionCreate {
	@On({ event: 'interactionCreate' })
	async interactionCreate([interaction]: ArgsOf<'interactionCreate'>, client: Client): Promise<void> {
		// do not execute interaction, if it's pagination (avoid warning: select-menu/button interaction not found)
		if (interaction.isButton() || interaction.isStringSelectMenu()) {
			if (interaction.customId.startsWith("discordx@pagination@")) {
				return;
			}
		}

		await client.executeInteraction(interaction);
	}
}
