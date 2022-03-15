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

		interaction.editReply({
			embeds: [{
				title: `${serverData.name} - Steam ID Search`,
				description: await ctx.steamID(interaction.options.get("name").value),
				color: "BLUE"
			}]
		});
	}
}
