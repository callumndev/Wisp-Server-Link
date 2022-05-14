const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	ephemeral: false,
	adminOnly: true,
	data: new SlashCommandBuilder()
		.setName("createbackup")
		.setDescription("Create a backup of a specific server")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("name")
				.setDescription("The name of the backup to create")
				.setRequired(true)
		),
	async execute({ bot, interaction }) {
		const ctx = bot.ctx.get(interaction.guild.id);
		if (!ctx) return bot.error(interaction, "ctx");
		
		const serverData = await ctx.serverData({ fetchResources: true });
		if (!serverData) return bot.error(interaction, "api");
		if (!serverData.serverOnline) return bot.error(interaction, "server_offline");
		
		const backups = await ctx.backups();
		const backupName = interaction.options.get("name").value;
		const backup = backups.find(backup => backup.backupName.toLowerCase() == backupName.toLowerCase());
		if (backup) return bot.error(interaction, "backup_exist");
		
		const create = await ctx.createBackup(backupName);
		if (!create) return bot.error(interaction, "api");

		interaction.editReply({
			embeds: [{
				title: serverData.name,
				description: `Creating backup ${backupName}`,
				color: "GREEN"
			}]
		});
	}
}
