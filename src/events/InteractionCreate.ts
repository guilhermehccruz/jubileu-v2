import { On, Discord } from 'discordx';
import type { ArgsOf, Client } from 'discordx';

@Discord()
export class InteractionCreate {
	@On({ event: 'interactionCreate' })
	async interactionCreate([interaction]: ArgsOf<'interactionCreate'>, client: Client): Promise<void> {
		await client.executeInteraction(interaction);
	}
}
