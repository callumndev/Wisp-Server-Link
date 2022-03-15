const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	ephemeral: false,
	adminOnly: true,
	data: new SlashCommandBuilder()
		.setName("restart")
		.setDescription("Restarts the server"),
	async execute({ bot, interaction }) {
		const ctx = bot.ctx.get(interaction.guild.id);
		if (!ctx) return bot.error(interaction, "ctx");

		const serverData = await ctx.serverData({ fetchResources: true });
		if (!serverData) return bot.error(interaction, "api");
		if (!serverData.serverOnline) return bot.error(interaction, "server_offline");

		const restartServer = await ctx.power("restart");
		if (!restartServer) return bot.error(interaction, "restart_server");

		interaction.editReply({
			embeds: [{
				title: serverData.name,
				description: "Restarting the server...",
				color: "GREEN"
			}]
		});
	}
}
