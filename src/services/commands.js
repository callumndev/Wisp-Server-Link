const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = class Commands {
    constructor(bot) {
        this._bot = bot;
    }

    async register(bot) {
        const commandsPath = path.join(__dirname, "..", "commands");
        const commands = fs.readdirSync(commandsPath);

        for (const commandFile of commands) {
            const command = require(path.join(commandsPath, commandFile));
            bot.commands.set(command.data.name, command);
        }
    
        const rest = new REST({ version: "9" }).setToken(bot.config.token);
        
        if (bot.config.updateCommandsGloballyOnReady || bot.config.updateCommandsTestingGuildOnReady) {
            try {
                bot.logger.debug("Started refreshing application (/) commands");
                
                let route;
                if (bot.config.updateCommandsGloballyOnReady) {
                    bot.logger.debug("Refresh for global");
                    route = Routes.applicationCommands(bot.config.clientID);
                } else {
                    bot.logger.debug("Refresh for testing guild");
                    route = Routes.applicationGuildCommands(bot.config.clientID, bot.config.testingGuild);
                }
                await rest.put(
                    route,
                    { body: Array.from(bot.commands, ([_, value]) => value).map(command => command.data.toJSON()) }
                )

                bot.logger.debug("Successfully reloaded application (/) commands");
            } catch (err) {
                bot.logger.error("Error reloading application (/) commands", err);                
            }
        }
    }
}
