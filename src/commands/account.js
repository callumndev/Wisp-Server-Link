const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	ephemeral: true,
	adminOnly: true,
	data: new SlashCommandBuilder()
		.setName("account")
		.setDescription("Retrieve the WISP account in use"),
	async execute({ bot, interaction }) {
		const api = bot.services.get("api");

		const { success, data: user } = await api.get("/auth/@me");
		if (!success) return api.apiError(interaction);

		const embed = new MessageEmbed()
			.addField("Name", user.name, false)
			.addField("Email", user.email, false)
			.addField("Flags", user.flags.map(flag => `\`${flag}\``).join(", ") || "None", false)
			.setFooter({
				text: "Note: This command is admin only & only you can see this"
			})
			.setColor("BLUE");

		interaction.editReply({ embeds: [embed] });
	}
}
