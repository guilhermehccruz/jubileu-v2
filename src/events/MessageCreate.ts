import { On, Discord } from 'discordx';
import type { ArgsOf, Client } from 'discordx';

@Discord()
export class MessageCreate {
	@On({ event: 'messageCreate' })
	async messageCreate([message]: ArgsOf<'messageCreate'>, client: Client): Promise<void> {
		await client.executeCommand(message);
	}
}
