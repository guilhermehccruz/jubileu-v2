import { Discord, SimpleCommand } from 'discordx';
import type { SimpleCommandMessage } from 'discordx';

@Discord()
export class Test {
	@SimpleCommand({ name: 'test', description: 'Comando teste' })
	async test({ message }: SimpleCommandMessage): Promise<void> {
		await message.reply('test');
	}
}
