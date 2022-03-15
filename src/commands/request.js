const { SlashCommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");

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
		),
	async execute({ bot, interaction }) {
		const ctx = bot.ctx.get(interaction.guild.id);
		if (!ctx) return bot.error(interaction, "ctx");

		if (!ctx.isRequestChannel(interaction)) return interaction.editReply({
			embeds: [{
				description: `Requests can only be made in <#${ctx.requestChannel}>`,
				color: "RED"
			}]
		});

		const serverData = await ctx.serverData({ fetchResources: true });
		if (!serverData) return bot.error(interaction, "api");
		if (!serverData.serverOnline) return bot.error(interaction, "server_offline");

		const command = interaction.options.get("command").value;
		const reply = await interaction.editReply({
			embeds: [{
				title: `:${serverData.serverOnline ? "green" : "red"}_circle: ${serverData.name}`,
				description: [
					`**Requester:** ${interaction.user}`,
					`**Command:** \`${command.replace("`", "\`").replace("*", "\*")}\``,
				].join("\n"),
				timestamp: Date.now(),
				color: "BLUE"
			}],
			components: [{
				type: 1,
				components: [
					{
						type: 2,
						label: "Accept",
						style: 3,
						custom_id: `accept_request-${Date.now()}`
					},
					{
						type: 2,
						label: "Deny",
						style: 4,
						custom_id: `deny_request-${Date.now()}`
					}
				]
			}]
		});

		const request = await ctx.getModel("main", "request");
		request.create({ message: reply.id, command });
	}
}
