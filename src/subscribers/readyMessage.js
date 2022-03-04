module.exports = class ReadyMessage {
    constructor() {
        this.subscribeTo = "ready";
    }

    run(bot) {
        const info = [ bot.user.tag, bot.user.id, `${bot.guilds.cache.size} guilds` ];
        bot.logger.info(`[READY]`, info.join(" - "));
    }
}
