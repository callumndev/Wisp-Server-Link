const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
	ephemeral: false,
	adminOnly: true,
	data: new SlashCommandBuilder()
		.setName("deploybackup")
		.setDescription("Deploy a backup from a specific server")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("backup")
				.setDescription("The ID or name of the backup you want to deploy")
				.setRequired(false)
		),
	async execute({ bot, interaction }) {
		const ctx = bot.ctx.get(interaction.guild.id);
		if (!ctx) return bot.error(interaction, "ctx");
		
		const serverData = await ctx.serverData({ fetchResources: true });
		if (!serverData) return bot.error(interaction, "api");
		if (!serverData.serverOnline) return bot.error(interaction, "server_offline");
		
		const backups = await ctx.backups();
		const backupSearch = interaction.options.get("backup").value;
		const backup = backups.find(backup => backup.backupID == backupSearch || backup.name.toLowerCase().includes(backupSearch.toLowerCase()));
		if (!backup) return bot.error(interaction, "backup_not_exist");

		const deploy = await ctx.deployBackup(backup.backupID);
		if (!deploy) return bot.error(interaction, "api");

		interaction.editReply({
			embeds: [{
				title: serverData.name,
				description: `Deploying backup ${backup.backupID}`,
				color: "GREEN"
			}]
		});
	}
}
