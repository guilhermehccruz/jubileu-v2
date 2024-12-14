import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, TextChannel } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { injectable } from 'tsyringe';

@Discord()
@injectable()
export class ReportCommand {
	@Slash({ description: 'Reporta uma mensagem de bug' })
	async report(
		@SlashOption({
			name: 'descrição',
			description: 'Descreva o bug e a situação em que ele aconteceu',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		description: string,
		interaction: CommandInteraction,
	): Promise<void> {
		const serversChannel = interaction.client.channels.cache.get(process.env.REPORTS_CHANNEL_ID) as TextChannel;

		await serversChannel.send({
			embeds: [
				new EmbedBuilder()
					.setTitle(
						`Servidor: ${interaction.guild!.name}\nCanal: ${(interaction.channel as TextChannel).name}`,
					)
					.setDescription(description)
					.setAuthor({
						name: `${interaction.user.displayName} @${interaction.user.tag}`,
						iconURL: interaction.user.avatarURL() ?? interaction.user.defaultAvatarURL,
					}),
			],
		});

		await interaction.reply({ content: 'Obrigado pelo report!', ephemeral: true });
	}
}
