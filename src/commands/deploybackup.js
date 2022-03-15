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

		if (!backups.length) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setTitle(`${server.serverOnline ? ":green_circle:" : ":red_circle:"} ${server.name}`)
						.setDescription("No backups found!")
						.setColor("RED")
				]
			});
		}

		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId("backup_select")
					.setPlaceholder("Select a backup")
					.addOptions(
						backups.map((backupObject, i) => {
							if (backupObject.object != "backup") return;

							const backup = backupObject.attributes;
							if (!backup) return;

							return {
								label: backup.name,
								get description() {
									const description = [
										bot.config.debug && { name: "UUID Short", value: backup.uuid_short },
										{ name: "Size", value: utils.bytesToString(backup.bytes) },
										{ name: "Created", value: `${utils.humanize(utils._dayjs(backup.created_at).diff(utils._dayjs(new Date()), "seconds"), "seconds")} ago` },
									].filter(Boolean);
									return description.map(desc => `${desc.name}: ${desc.value}`).join(" - ");
								},
								value: backup.uuid_short
							}
						}).filter(Boolean)
					),
			);

		const deploySelectMsg = await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle(`${server.serverOnline ? ":green_circle:" : ":red_circle:"} ${server.name}`)
					.setDescription("Select a backup to deploy")
					.setColor("BLUE")
			],
			components: [row]
		});
		const filter = i => i.customId == "backup_select" && i.user.id == interaction.user.id;
        const backup = await utils.createInteractionCollector(deploySelectMsg, { filter, time: 10000, max: 1 });
		if (!backup) return await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle(`${server.serverOnline ? ":green_circle:" : ":red_circle:"} ${server.name}`)
					.setDescription("Select a backup to deploy")
					.setFooter({
						text: "Timed Out"
					})
					.setColor("BLUE")
			],
			components: []
		});

		const backupID = backup.values[0];
		const { success: successDeploy } = await api.post(`/servers/${server.id}/backups/${backupID}/deploy`);
		if (!successDeploy) return api.apiError(interaction);
		
		interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle(`${server.serverOnline ? ":green_circle:" : ":red_circle:"} ${server.name}`)
					.setDescription(`Deploying backup ${backupID}`)
					.setColor("BLUE")
			]
		});
	}
}
