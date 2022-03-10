const { SlashCommandBuilder, codeBlock } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	ephemeral: false,
	adminOnly: false,
	data: new SlashCommandBuilder()
		.setName("servers")
		.setDescription("List of servers"),
	async execute({ bot, interaction }) {
		const api = bot.services.get("api");

		const { success, data: servers } = await api.get("/servers?include=allocations");
		if (!success) return api.apiError(interaction);

		const embed = new MessageEmbed()
			.addFields(servers.map(server => {
				return {
					name: `${server.serverOnline ? ":green_circle:" : ":red_circle:"} ${server.name}`,
					get value() {
						const description = [
							bot.config.get("debug") && { name: "UUID Short", value: server.id },
							{ name: "IP", value: server.ip },
							{ name: "Players", value: server.serverOnline ? `${server.playerCount}/${server.maxPlayers}` : "Offline" },
							{ name: "Gamemode", value: server.serverOnline ? server.gamemode : "Offline" },
							{ name: "Map", value: server.serverOnline ? server.map : "Offline" },
						].filter(Boolean);
						return description.map(desc => `**${desc.name}:** ${desc.value}`).join("\n");
					},
					inline: true
				}
			}))
			.setColor("BLUE");

		interaction.editReply({ embeds: [embed] });
	}
}
