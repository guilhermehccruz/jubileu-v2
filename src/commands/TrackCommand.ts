import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Discord, SlashOption } from 'discordx';
import { rastreio } from 'rastreio-correios';

import { SlashWithAliases } from '../decorators/SlashWithAliases';

@Discord()
export class TrackCommand {
	@SlashWithAliases(
		{
			name: 'track',
			description: 'Searches for the status of a package',
			descriptionLocalizations: { 'pt-BR': 'Pesquisa o status de entrega do correio' },
		},
		['rastrear'],
	)
	async track(
		@SlashOption({
			name: 'code',
			nameLocalizations: { 'pt-BR': 'código' },
			description: 'Tracking code',
			descriptionLocalizations: { 'pt-BR': 'Código de rastreio do pedido' },
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		code: string,
		interaction: CommandInteraction,
	): Promise<void> {
		await interaction.deferReply();

		const [tracking] = await rastreio(code);
		if (!tracking.sucesso) {
			await interaction.followUp({
				content: `> ${tracking.mensagem ?? 'Ocorreu um erro na busca dos dados'}`,
				ephemeral: true,
			});
			return;
		}

		const embeds: EmbedBuilder[] = [];

		for (const event of tracking.eventos ?? []) {
			const embed = new EmbedBuilder().setTitle(`Status: ${event.status}`);

			const description = [`Data: ${event.data.split('-').reverse().join('/')} ${event.hora}`];

			if (event.origem) {
				const origem =
					event.origem === 'País -  / ' && tracking.rastreio.endsWith('HK') ? 'China' : event.origem;

				description.push(`Origem: ${origem}`);
			}

			if (event.destino) {
				const destino = event.destino === 'País -  / BR' ? 'Brasil' : event.destino;

				description.push(`Destino: ${destino}`);
			}

			embed.setDescription(description.join('\n'));
			embeds.push(embed);
		}

		await interaction.followUp({
			content: `>>> Entrega ${tracking.rastreio} encontrada! \nEntregue: ${tracking.entregue ? 'Sim' : 'Não'}`,
			embeds,
		});
	}
}
