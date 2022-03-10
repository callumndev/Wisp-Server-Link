const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	ephemeral: false,
	adminOnly: true,
	data: new SlashCommandBuilder()
		.setName("request")
		.setDescription("Submit a command request for a specific server")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("command")
				.setDescription("The command to request for sending to the server")
				.setRequired(true)
		)
		.addStringOption(
			new SlashCommandStringOption()
				.setName("server")
				.setDescription("The ID, name or IP of the server you want to view")
				.setRequired(false)
		),
	async execute({ bot, interaction }) {
		const api = bot.services.get("api");
		const utils = bot.services.get("utils");
		const database = bot.services.get("database");

		if (interaction.channel.id != bot.config.get("requestChannel")) return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setDescription(`Requests can only be made in <#${bot.config.get("requestChannel")}>`)
					.setColor("RED")
			]
		})

		const { success: successAllServers, data: servers } = await api.get("/servers?include=allocations");
		if (!successAllServers) return api.apiError(interaction);

		const server = utils.getServerFromID({ bot, interaction, servers });
		if (!server.serverOnline) return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle(`${server.serverOnline ? ":green_circle:" : ":red_circle:"} ${server.name}`)
					.setDescription("Server is offline")
					.setColor("RED")
			]
		});

		const command = interaction.options.get("command").value;
		const embed = new MessageEmbed()
			.setTitle(`${server.serverOnline ? ":green_circle:" : ":red_circle:"} ${server.name}`)
			.setDescription([
				`**Requester:** ${interaction.user}`,
				`**Command:** \`${command.replace("`", "\`").replace("*", "\*")}\``,
			].join("\n"))
			.setTimestamp()
			.setColor("BLUE");

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(`accept_request-${"REQ_ID"}`)
					.setLabel("Accept")
					.setStyle("SUCCESS"),
				new MessageButton()
					.setCustomId(`deny_request-${"REQ_ID"}`)
					.setLabel("Deny")
					.setStyle("DANGER"),
			);

		const reply = await interaction.editReply({ embeds: [embed], components: [row] });
		const request = await database.get("request");

		request.create({
			message: reply.id,
			channel: reply.channelId,
			requester: interaction.user.id,
			command,
			server: server.id
		});
	}
}
