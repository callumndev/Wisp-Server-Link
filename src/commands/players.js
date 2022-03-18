const { SlashCommandBuilder } = require("@discordjs/builders");
const { Op } = require("sequelize");

module.exports = {
	ephemeral: false,
	adminOnly: false,
	data: new SlashCommandBuilder()
		.setName("players")
		.setDescription("View a list of players on the server"),
	async execute({ bot, interaction }) {
		const ctx = bot.ctx.get(interaction.guild.id);
		if (!ctx) return bot.error(interaction, "ctx");

		const serverData = await ctx.serverData({ fetchResources: true });
		if (!serverData) return bot.error(interaction, "api");
		if (!serverData.serverOnline) return bot.error(interaction, "server_offline");
		if (serverData.playerCount == 0) return bot.error(interaction, "no_players");

		const playerModel = await ctx.getModel("main", "player");
		const playerTable = [
			["Name", "Time Connected", "Steam ID"],
			...await Promise.all(
				serverData.players
					.sort((a, b) => b.timeConnected - a.timeConnected)
					.map(async player => {
						const dbPlayer = await playerModel.findOne({
							where: {
								SteamName: {
									[Op.regexp]: player.name.toLowerCase()
								}
							},
							raw: true
						});

						return [player.name, player.timeConnected, dbPlayer.SteamID || ""].filter(Boolean)
					})
			)
		]

		interaction.editReply({
			embeds: [{
				title: [
					serverData.name,
					`${serverData.playerCount} ${ctx.utils.pluralize("Player", serverData.playerCount)}`
				].join(" - "),
				description: "```" + ctx.utils.table(playerTable) + "```",
				color: "BLUE"
			}]
		});
	}
}
