const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = class API {
    constructor(bot) {
        this._bot = bot;
        this._config = require("../config");
        this._instance = axios.create({
            baseURL: `https://${this._config.panelDomain}/api/client`,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/vnd.wisp.v1+json",
                "Authorization": `Bearer ${this._config.apiKey}`
            }
        });
    }

    apiError(interaction) {
        const embed = new MessageEmbed()
            .setTitle("API Error")
            .setDescription("Error interacting with the game panel API, please try again later")
            .setColor("RED");
        return interaction.editReply(embed);
    }

    async get(endpoint) {
        try {
            const request = await this._instance.get(endpoint);
            return { success: true, data: request.data };
        } catch (err) {
            this._bot.logger.error(`Error executing get request for endpoint "${endpoint}"`, err);
            return { success: false, data: null };
        }
    }
}
