const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const relativeTime = require("dayjs/plugin/relativeTime");

module.exports = class Utils {
    constructor(bot) {
        this._bot = bot;
        this._config = require("../config");

        this._dayjs = dayjs;
        this._dayjs.extend(duration);
        this._dayjs.extend(relativeTime);
    }

    getServerFromID({ interaction, servers }) {
        const serverOption = interaction.options.get("server")?.value;
        const server = serverOption && servers.find(server => (
            server.id.toLowerCase().includes(serverOption.toLowerCase()) ||
            server.name.toLowerCase().includes(serverOption.toLowerCase()) ||
            server.ip.toLowerCase().includes(serverOption.toLowerCase())
        ));

        return (
            server ||
            servers.find(server => (
                server.id == this._bot.config.get("guilds").find(guild => guild.id == interaction.guildId)?.server
            )) ||
            servers[0]
        )
    }

    humanize(time, unit) {
        return this._dayjs.duration(time, unit).humanize();
    }

    bytesToString(bytes) {
        if (bytes == 0) return "0b";

        const k = 1024;
        const sizes = ["b", "kb", "mb", "gb", "tb"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))}${sizes[i].toUpperCase()}`;
    }

    findByKey(map, searchValue) {
        for (let [key, value] of map.entries()) {
            if (key == searchValue || key instanceof RegExp && key.test(searchValue)) return value;
        }
        return null;
    }
    
    isAdminGroup(group) {
        return this._config.staffUserGroups.includes(group);
    }

    createInteractionCollector(message, { filter, time = 60000, max = 0 }) {
        if(!message) return;

        return new Promise(res => {
            let interactionCollector = message.createMessageComponentCollector({filter, time, max});
            
            interactionCollector.on("end", collected => res(max == 1 ? collected.first() : collected));
        })
    }
}
