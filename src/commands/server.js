const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	ephemeral: false,
	adminOnly: false,
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("View information on the server"),
	async execute({ bot, interaction }) {
		const ctx = bot.ctx.get(interaction.guild.id);
		if (!ctx) return bot.error(interaction, "ctx");

		const serverData = await ctx.serverData({ includeAllocations: true, fetchResources: true });
		if (!serverData) return bot.error(interaction, "api");

		const serverInfo = [
			{ name: "ID", value: serverData.id },
			{ name: "IP", value: serverData.ip },
			{ name: "Players", value: serverData.serverOnline ? `${serverData.playerCount}/${serverData.maxPlayers}` : "Offline" },
			{ name: "Gamemode", value: serverData.serverOnline ? serverData.gamemode : "Offline" },
			{ name: "Map", value: serverData.serverOnline ? serverData.map : "Offline" },
		].filter(Boolean).map(info => Object.assign(info, { inline: true }));

		interaction.editReply({
			embeds: [{
				title: `:${serverData.serverOnline ? "green" : "red"}_circle: ${serverData.name}`,
				fields: serverInfo,
				color: "BLUE"
			}]
		});
	}
}
