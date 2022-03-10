const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Op } = require("sequelize");

module.exports = {
	ephemeral: false,
	adminOnly: false,
	data: new SlashCommandBuilder()
		.setName("steamid")
		.setDescription("Retrieve a users steam ID from their steam name")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("name")
				.setDescription("The name of the user you want to view")
				.setRequired(true)
		),
	async execute({ bot, interaction }) {
		const database = bot.services.get("database");
		const utils = bot.services.get("utils");

		const player = await database.get("player");
		const players = await player.findAll({
            where: {
                SteamName: {
                    [Op.regexp]: interaction.options.get("name").value.toLowerCase()
                }
            },
            limit: 10,
            raw: true
        });
		
		const embed = new MessageEmbed()
			.setTitle(`Steam ID`)
			.setDescription(players.sort((a, b) => b.TimePlayed - a.TimePlayed).map(player => [
				`**Player:** ${player.SteamName} (${player.SteamID})`,
				`**Time Played:** ${utils.humanize(player.TimePlayed, "seconds")}`,
				player.Rank && `**Rank:** ${player.Rank && utils.isAdminGroup(player.Rank) ? ":shield: " : ""}${player.Rank}`,
			].filter(Boolean).join(" - ")).join("\n") || "No players found!")
			.setColor("BLUE");

		interaction.editReply({ embeds: [embed] });
	}
}
