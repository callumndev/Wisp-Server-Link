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
        return interaction.editReply({ embeds: [ embed ] });
    }

    async _getRequest(endpoint) {
        try {
            const { data } = await this._instance.get(endpoint);
            return data;
        } catch (err) {
            this._bot.logger.error(`Error executing _getRequest:`, err);
            return null;
        }
    }

    async _postRequest(endpoint, postData) {
        try {
            const { data, status } = await this._instance.post(endpoint, postData);
            return { data, status };
        } catch (err) {
            this._bot.logger.error(`Error executing _postRequest:`, err);
            return null;
        }
    }

    async useApi(endpoint, method, postData) {
        try {
            if (!Object.prototype.hasOwnProperty.call(this._instance, method)) {
                throw new Error(`Unknown method "${method}"`);
            }
            
            const apiRoute = this._bot.services.get("utils").findByKey(this._bot.apiRoutes, endpoint);
            if (!apiRoute) {
                throw new Error(`Unknown API route "${endpoint}"`);
            }

            const requestMethod = apiRoute[method];
            const data = await requestMethod.call(Object.assign(this, { apiRoute: apiRoute.apiRoute }), { endpoint, postData });
            if (!data) throw `Endpoint "${endpoint}" with method "${method}" returned invalid data`;
            
            return { success: true, data };
        } catch (err) {
            this._bot.logger.error(`Error executing ${method} request for endpoint "${endpoint}":`, err);
            return { success: false, data: null };
        }
    }

    async get(endpoint) {
        return await this.useApi(endpoint, "get");
    }

    async post(endpoint, data) {
        return await this.useApi(endpoint, "post", data);
    }
}
