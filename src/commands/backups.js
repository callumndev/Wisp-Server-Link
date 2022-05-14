const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	ephemeral: false,
	adminOnly: true,
	data: new SlashCommandBuilder()
		.setName("backups")
		.setDescription("Retrieve a list of backups from a specific server"),
	async execute({ bot, interaction }) {
		const ctx = bot.ctx.get(interaction.guild.id);
		if (!ctx) return bot.error(interaction, "ctx");
		
		const serverData = await ctx.serverData({ fetchResources: true });
		if (!serverData) return bot.error(interaction, "api");
		if (!serverData.serverOnline) return bot.error(interaction, "server_offline");
		
		const backups = await ctx.backups();
		const embed = new MessageEmbed()
			.setTitle(serverData.name)
			.setDescription(!backups.length ? "No backups found!" : "")
			.addFields(backups)
			.setColor("GREEN");

		interaction.editReply({ embeds: [embed] });
	}
}
