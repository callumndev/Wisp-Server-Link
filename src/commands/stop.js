const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	ephemeral: false,
	adminOnly: true,
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Stops the server from running"),
	async execute({ bot, interaction }) {
		const ctx = bot.ctx.get(interaction.guild.id);
		if (!ctx) return bot.error(interaction, "ctx");

		const serverData = await ctx.serverData({ fetchResources: true });
		if (!serverData) return bot.error(interaction, "api");
		if (!serverData.serverOnline) return bot.error(interaction, "server_already_offline");

		const stopServer = await ctx.power("stop");
		if (!stopServer) return bot.error(interaction, "stop_server");

		interaction.editReply({
			embeds: [{
				title: serverData.name,
				description: "Stopping the server...",
				color: "GREEN"
			}]
		});
	}
}
