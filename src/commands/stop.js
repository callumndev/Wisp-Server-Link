const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	ephemeral: false,
	adminOnly: true,
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Stops a specific server")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("server")
				.setDescription("The ID, name or IP of the server you want to view")
				.setRequired(false)
		),
	async execute({ bot, interaction }) {
		const api = bot.services.get("api");
		const utils = bot.services.get("utils");

		const { success: successAllServers, data: servers } = await api.get("/servers?include=allocations");
		if (!successAllServers) return api.apiError(interaction);

		const server = utils.getServerFromID({ bot, interaction, servers });
		if (!server.serverOnline) return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle(`${server.serverOnline ? ":green_circle:" : ":red_circle:"} ${server.name}`)
					.setDescription("Server is already offline")
					.setColor("RED")
			]
		});

		const { success } = await api.post(`/servers/${server.id}/power`, { signal: "stop" });
		if (!success) return api.apiError(interaction);

		const embed = new MessageEmbed()
			.setTitle(`${server.serverOnline ? ":green_circle:" : ":red_circle:"} ${server.name}`)
			.setDescription("Sent stop power signal")
			.setColor("RED");

		interaction.editReply({ embeds: [embed] });
	}
}
