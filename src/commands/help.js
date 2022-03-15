const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	ephemeral: false,
	adminOnly: false,
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Retrieve a list of commands"),
	async execute({ bot, interaction }) {
		const embed = new MessageEmbed()
			.setTitle(bot.user.username)
			.addFields(
				Array.from(bot.commands, ([name, command]) => ({ name, command }))
					.map(({ name, command }) => {
						if (command.adminOnly && !bot.config.admins.includes(interaction.user.id)) return;

						return {
							name: `${command.adminOnly ? ":shield: " : ""}/${name}`,
							value: command.data.description,
							inline: true
						}
					})
					.filter(Boolean)
			)
			.setColor("BLUE");

		interaction.editReply({ embeds: [embed] });
	}
}
