const { Permissions } = require("discord.js");

module.exports = class LogInvite {
    constructor() {
        this.subscribeTo = "ready";
    }
    
    run(bot) {
        if (!bot.config.logInviteOnReady) return;
        
        const link = bot.generateInvite({
            scopes: ["bot", "applications.commands"],
            permissions: Permissions.FLAGS.ADMINISTRATOR
        });
        bot.logger.info(link);
    }
}
