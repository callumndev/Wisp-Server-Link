const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	ephemeral: false,
	adminOnly: false,
	data: new SlashCommandBuilder()
		.setName("players")
		.setDescription("View a list of players on a specific server")
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
		const embed = new MessageEmbed()
			.setTitle(`${server.serverOnline ? ":green_circle:" : ":red_circle:"} ${server.name}`)
			.setDescription(server.players.sort((a, b) => b.timeConnected - a.timeConnected).map(player => [
				`**Name:** ${player.name}`,
				`**Time Connected:** ${utils.humanize(player.timeConnected, "seconds")}`
			].join(" - ")).join("\n") || "No players connected!")
			.setColor("BLUE");

		interaction.editReply({ embeds: [embed] });
	}
}
