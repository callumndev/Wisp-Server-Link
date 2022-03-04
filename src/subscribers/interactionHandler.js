module.exports = class InteractionHandler {
    constructor() {
        this.subscribeTo = "interactionCreate";
    }

    async run(bot, interaction) {
        if (!interaction.isCommand()) return;
        
        const { commandName, options } = interaction;
        if (bot.commands.has(commandName)) {
            try {
                const command = bot.commands.get(commandName);
                await interaction.deferReply({ ephemeral: !!command.ephemeral });

                if (command.adminOnly && !bot.config.get("admins").includes(interaction.user.id)) {
                    return interaction.editReply("That command is admin only!");
                }
                await command.execute({ bot, interaction, options });
            } catch (err) {
                bot.logger.error(`Error executing command "${commandName}":`, err);
                await interaction.editReply("There was an error while executing this command!");
            }
        }
    }
}
