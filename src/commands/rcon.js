const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	ephemeral: false,
	adminOnly: true,
	data: new SlashCommandBuilder()
		.setName("rcon")
		.setDescription("Send an RCON (Remote Console) command to a specific server")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("command")
				.setDescription("The RCON command to send to the server")
				.setRequired(true)
		),
	async execute({ bot, interaction }) {
		const ctx = bot.ctx.get(interaction.guild.id);
		if (!ctx) return bot.error(interaction, "ctx");
		
		const serverData = await ctx.serverData({ fetchResources: true });
		if (!serverData) return bot.error(interaction, "api");
		if (!serverData.serverOnline) return bot.error(interaction, "server_offline");
		
		const rcon = await ctx.rcon(interaction.options.get("command").value);
		if (!rcon) return bot.error(interaction, "api");
		
		interaction.editReply({
			embeds: [{
				title: serverData.name,
				description: "RCON command successfully sent",
				color: "GREEN"
			}]
		});
	}
}
