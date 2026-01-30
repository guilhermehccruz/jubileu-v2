import { ButtonInteraction, CommandInteraction, DiscordAPIError, InteractionReplyOptions, Message } from 'discord.js';

export async function selfDestruct({ interaction, followUp, timeout = 60_000 }: SelfDestructParams): Promise<void> {
	try {
		if (!interaction) {
			return;
		}

		if (followUp && !(interaction instanceof Message)) {
			await interaction.followUp(followUp).catch(() => null);
		}

		if (timeout === 0) {
			await deleteInteraction(interaction).catch(() => null);
			return;
		}

		setTimeout(async () => await deleteInteraction(interaction), timeout);
	} catch {
		// Could not delete message, ignore it
	}
}

async function deleteInteraction(interaction: CommandInteraction | ButtonInteraction | Message) {
	if (interaction instanceof Message) {
		await interaction.delete().catch(() => null);
		return;
	}

	await interaction.deleteReply().catch(async (error) => {
		if (error instanceof DiscordAPIError && error.status === 404) {
			const message = await interaction.fetchReply().catch(() => null);

			if (message?.deletable) {
				await message.delete().catch(() => null);
			}
		}

		return null;
	});
}

export interface SelfDestructParams {
	interaction?: CommandInteraction | ButtonInteraction | Message | null;
	followUp?: string | InteractionReplyOptions;
	timeout?: number;
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
