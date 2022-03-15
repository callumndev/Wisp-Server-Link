const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	ephemeral: false,
	adminOnly: false,
	data: new SlashCommandBuilder()
		.setName("servers")
		.setDescription("List of servers"),
	async execute({ bot, interaction }) {
		const servers = [];
		
		for (const [_, ctx] of bot.ctx.entries()) {
			const serverData = await ctx.serverData({ includeAllocations: true, fetchResources: true });
			if (!serverData) return bot.error(interaction, "api");
			
			const name = `:${serverData.serverOnline ? "green" : "red"}_circle: ${serverData.name}`;
			const value = [
				{ name: "ID", value: serverData.id },
 				{ name: "IP", value: serverData.ip },
				{ name: "Players", value: serverData.serverOnline ? `${serverData.playerCount}/${serverData.maxPlayers}` : "Offline" },
				{ name: "Gamemode", value: serverData.serverOnline ? serverData.gamemode : "Offline" },
				{ name: "Map", value: serverData.serverOnline ? serverData.map : "Offline" },
			].filter(Boolean).map(desc => `**${desc.name}:** ${desc.value}`).join("\n");
			
			servers.push({ name, value, inline: true });
		}
		
		if (!servers.length) return bot.error(interaction, "no_servers");
		
		interaction.editReply({
			embeds: [{
				fields: servers,
				color: "BLUE"
			}]
		});
	}
}
