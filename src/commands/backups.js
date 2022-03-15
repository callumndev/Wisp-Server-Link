const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	ephemeral: false,
	adminOnly: true,
	data: new SlashCommandBuilder()
		.setName("backups")
		.setDescription("Retrieve a list of backups from a specific server")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("server")
				.setDescription("The ID, name or IP of the server you want to view")
				.setRequired(false)
		),
	async execute({ bot, interaction }) {
		const api = bot.services.get("api");
		const utils = bot.services.get("utils");

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

		const { success, data: backups } = await api.get(`/servers/${server.id}/backups`);
		if (!success) return api.apiError(interaction);

		const embed = new MessageEmbed()
			.setTitle(`${server.serverOnline ? ":green_circle:" : ":red_circle:"} ${server.name}`)
			.setDescription(!backups.length ? "No backups found!" : "")
			.addFields(
				backups.map((backupObject, i) => {
					if (backupObject.object != "backup") return;

					const backup = backupObject.attributes;
					if (!backup) return;

					return {
						name: `${i + 1}.) ${backup.name}`,
						get value() {
							const description = [
								bot.config.debug && { name: "UUID Short", value: backup.uuid_short },
								{ name: "Size", value: utils.bytesToString(backup.bytes) },
								{ name: "Created", value: `${utils.humanize(utils._dayjs(backup.created_at).diff(utils._dayjs(new Date()), "seconds"), "seconds")} ago` },
							].filter(Boolean);
							return description.map(desc => `**${desc.name}:** ${desc.value}`).join("\n");
						},
						inline: true
					}
				}).filter(Boolean)
			)
			.setColor("GREEN");

		interaction.editReply({ embeds: [embed] });
	}
}
