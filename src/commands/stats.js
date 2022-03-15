const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	ephemeral: false,
	adminOnly: false,
	data: new SlashCommandBuilder()
		.setName("stats")
		.setDescription("View the stats of the server"),
	async execute({ bot, interaction }) {
		const ctx = bot.ctx.get(interaction.guild.id);
		if (!ctx) return bot.error(interaction, "ctx");

		const serverData = await ctx.serverData({ fetchResources: true });
		if (!serverData) return bot.error(interaction, "api");
		
		interaction.editReply({
			embeds: [{
				title: `:${serverData.serverOnline ? "green" : "red"}_circle: ${serverData.name}`,
				fields: [
					{ name: "Memory", value: ctx.utils.formatBytes(serverData.memoryUsage), inline: true },
					{ name: "CPU", value: `${serverData.cpuUsage.toFixed(2)}%`, inline: true },
					{ name: "Disk", value: ctx.utils.formatBytes(serverData.diskUsage), inline: true },
				].filter(Boolean),
				color: "BLUE"
			}]
		});
	}
}
