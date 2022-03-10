module.exports = class RequestHandler {
    constructor() {
        this.subscribeTo = "interactionCreate";
    }

    async run(bot, interaction) {
        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith("accept_request") && !interaction.customId.startsWith("deny_request")) return bot.logger.error("Button interaction did not start with accept_request or deny_request");
                
        const requestAcceptRoles = bot.config.get("requestAcceptRoles");
        if (!requestAcceptRoles.some(role => interaction.member.roles.cache.has(role))) return bot.logger.error("User does not have permissions to accept requests");

		const database = bot.services.get("database");
		const request = await database.get("request");
        
        const userReq = await request.findOne({ where: { message: interaction.message.id }, raw: true });
        if (!userReq) return bot.logger.error("DataBase entry for request was not found");
        
        const now = Math.floor(Date.now() / 1000);
        interaction.reply(`**${interaction.customId.startsWith("accept_request") ? "Accepted" : "Denied"}** by ${interaction.user} at <t:${now}:f> (<t:${now}:R>)`);
        interaction.message.edit({ components: [] });

        try {
            if (interaction.customId.startsWith("accept_request")) {
                const api = bot.services.get("api");
                
                const { success } = await api.post(`/servers/${userReq.server}/command`, { command: userReq.command });
                if (!success) throw "API Error";
            }
        } catch (err) {
            bot.logger.error("Error sending rcon command for request:", err);
        } finally {
            request.destroy({ where: userReq });
        }
    }
}
