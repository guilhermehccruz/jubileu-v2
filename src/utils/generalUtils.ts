import { ButtonInteraction, CommandInteraction, DiscordAPIError, InteractionReplyOptions, Message } from 'discord.js';

export async function selfDestruct({ interaction, followUp, timeout = 60_000 }: SelfDestructParams) {
	if (!interaction) {
		return;
	}

	if (interaction instanceof Message) {
		setTimeout(() => {
			if (interaction?.deletable) {
				void interaction.delete().catch(() => null);
			}
		}, timeout);

		return;
	}

	if (followUp) {
		await interaction.followUp(followUp);
	}

	setTimeout(() => {
		void interaction.deleteReply().catch(async (error) => {
			if (error instanceof DiscordAPIError && error.status === 404) {
				console.log(interaction.id);
				const message = await interaction.fetchReply();

				if (message?.deletable) {
					await message.delete().catch(() => null);
				}
			}

			return null;
		});
	}, timeout);
}

export interface SelfDestructParams {
	interaction?: CommandInteraction | ButtonInteraction | Message | null;
	followUp?: string | InteractionReplyOptions;
	timeout?: number;
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
