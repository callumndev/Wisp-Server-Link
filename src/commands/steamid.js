const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");

module.exports = {
	ephemeral: false,
	adminOnly: false,
	data: new SlashCommandBuilder()
		.setName("steamid")
		.setDescription("Retrieve a users steam ID from their steam name")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("name")
				.setDescription("The name of the user you want to view")
				.setRequired(true)
		),
	async execute({ bot, interaction }) {
		const ctx = bot.ctx.get(interaction.guild.id);
		if (!ctx) return bot.error(interaction, "ctx");

		const serverData = await ctx.serverData();
		if (!serverData) return bot.error(interaction, "api");

		const players = await ctx.steamID(interaction.options.get("name").value);
		if (!players.length) return bot.error(interaction, "no_players_query");

		const playerTable = [
			["Steam Name", "Steam ID", "Time Played"],
			...await Promise.all(
				players
					.map(player => (
						[
							player.steamName,
							player.steamID,
							player.timePlayed
						]
					))
			)
		]

		interaction.editReply({
			embeds: [{
				title: `${serverData.name} - Steam ID Search`,
				description: "```" + ctx.utils.table(playerTable) + "```",
				color: "BLUE"
			}]
		});
	}
}
