const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	ephemeral: false,
	adminOnly: false,
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("View information on a specific server")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("server")
				.setDescription("The ID, name or IP of the server you want to view")
				.setRequired(false)
		),
	async execute({ bot, interaction }) {
		const api = bot.services.get("api");
		const utils = bot.services.get("utils");

		const { success, data: servers } = await api.get("/servers?include=allocations");
		if (!success) return api.apiError(interaction);

		const server = utils.getServerFromID({ bot, interaction, servers });
		const description = [
			bot.config.get("debug") && { name: "UUID Short", value: server.id, inline: true },
			{ name: "IP", value: server.ip, inline: true },
			{ name: "Players", value: server.serverOnline ? `${server.playerCount}/${server.maxPlayers}` : "Offline", inline: true },
			{ name: "Gamemode", value: server.serverOnline ? server.gamemode : "Offline", inline: true },
			{ name: "Map", value: server.serverOnline ? server.map : "Offline", inline: true },
		].filter(Boolean);

		const embed = new MessageEmbed()
			.setTitle(`${server.serverOnline ? ":green_circle:" : ":red_circle:"} ${server.name}`)
			.addFields(description)
			.setColor("BLUE");

		interaction.editReply({ embeds: [embed] });
	}
}
