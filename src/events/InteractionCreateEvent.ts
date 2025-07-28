import { On, Discord } from 'discordx';
import type { ArgsOf, Client } from 'discordx';

@Discord()
export class InteractionCreateEvent {
	@On({ event: 'interactionCreate' })
	async interactionCreate([interaction]: ArgsOf<'interactionCreate'>, client: Client): Promise<void> {
		// do not execute interaction, if it's pagination (avoid warning: select-menu/button interaction not found)
		if (interaction.isButton() || interaction.isStringSelectMenu()) {
			if (interaction.customId.startsWith('discordx@pagination@')) {
				return;
			}
		}

		try {
			await client.executeInteraction(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.isCommand() && !interaction.replied) {
				await interaction.followUp({ content: '> Ocorreu um erro', ephemeral: true });
			}
		}
	}
}
