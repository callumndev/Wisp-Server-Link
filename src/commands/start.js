const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	ephemeral: false,
	adminOnly: true,
	data: new SlashCommandBuilder()
		.setName("start")
		.setDescription("Starts the server"),
	async execute({ bot, interaction }) {
		const ctx = bot.ctx.get(interaction.guild.id);
		if (!ctx) return bot.error(interaction, "ctx");

		const serverData = await ctx.serverData({ fetchResources: true });
		if (!serverData) return bot.error(interaction, "api");
		if (serverData.serverOnline) return bot.error(interaction, "server_already_online");

		const startServer = await ctx.power("start");
		if (!startServer) return bot.error(interaction, "start_server");

		interaction.editReply({
			embeds: [{
				title: serverData.name,
				description: "Starting the server...",
				color: "GREEN"
			}]
		});
	}
}
