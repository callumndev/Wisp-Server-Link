const { Client, Intents, Constants } = require("discord.js");
const fs = require("fs");
const path = require("path");
const Logger = require("./logger");
const Config = require("./config");
const Utils = require("./utils");
const ContextManager = require("./contextManager");
const { MessageEmbed } = require("discord.js");
const CronJob = require('cron').CronJob;


function clientOptions(options) {
    if (Array.isArray(options.intents)) {
        options.intents = options.intents.map(intent => {
            if (!Intents.FLAGS[intent]) {
                throw new Error(`Unknown intent "${intent}"`);
            }

            return Intents.FLAGS[intent];
        })
    }
    return options;
}
module.exports = class Bot extends Client {
    logger = new Logger();
    config = Config;
    utils = new Utils();

    constructor(options) {
        super(clientOptions(options));
        
        this.ctx = new Map();
        this.services = new Map();
        this.subscribers = new Map();
        this.commands = new Map();
        
        for (const guild in this.config.context) {
            if (Object.hasOwnProperty.call(this.config.context, guild)) {
                this.ctx.set(guild, ContextManager.Create(guild));
            }
        }
        new CronJob(this.config.clearServerDataCacheCronTime, () => this.ctx.forEach(async (ctx, guild) => {
            this.ctx.set(guild, ctx.clearServerDataCache());
            this.logger.debug(`Cleared server data cache of server ${ctx.server} (${guild})`);
        })).start();
        
        this.init();
    }

    init() {
        // Services
        const servicesPath = path.join(__dirname, "services");
        const servicesErrors = [];
        fs.readdirSync(servicesPath).forEach(serviceName => {
            let service = require(path.join(servicesPath, serviceName));
            const name = service.name;
            try {
                service = new service(this);
            } catch (err) {
                servicesErrors.push(err);
            }
            this.services.set(name.toLowerCase(), service);
        })
        this.services.get("commands").register(this);
        if (servicesErrors.length) {
            this.logger.error("Error invoking services:", ...servicesErrors);
        }
        this.logger.debug(`Finished loading ${this.services.size} services`);


        // Subscribers
        const subscribersPath = path.join(__dirname, "subscribers");
        fs.readdirSync(subscribersPath).forEach(subscriberName => {
            let subscriber = require(path.join(subscribersPath, subscriberName));
            const name = subscriber.name;
            subscriber = new subscriber();
            this.subscribers.set(name, subscriber);
        })
        for (const event of Object.values(Constants.Events)) {
            if (event == "raw") continue;

            this.on(event, (...args) => {
                if (event == "debug") {
                    if (this.config.enableDiscordJSDebug) {
                        this.logger.debug(...args);
                    }
                    return;
                }

                this.subscriberHandler(event, args);
            })
        }
        this.logger.debug(`Finished loading ${this.subscribers.size} subscribers`);


        // Start
        this.logger.debug(`Logging in`);
        this.login(this.config.token);
    }

    async subscriberHandler(event, data) {
        if (!event) return;

        const subscribers = Array.from(this.subscribers, ([_, value]) => value).filter(subscriber => subscriber.subscribeTo.toLowerCase() == event.toLowerCase());
        if (!subscribers.length) return;

        this.logger.debug(`Found ${subscribers.length} subscribers for event ${event}`);

        for (let i = 0; i < subscribers.length; i++) {
            const subscriber = subscribers[i];
            try {
                this.logger.debug(`Executing subscriber ${i + 1}/${subscribers.length} for event ${event}`);
                subscriber.run(this, ...data)
            } catch (err) {
                this.logger.error(`Could not execute subscriber ${i + 1}/${subscribers.length} for event ${event}:`, err);
            }
        }

        this.logger.debug(`Finished executing all subscribers for event ${event}`);
    }

    error(interaction, type) {
        const errors = [
            // Services
            {
                type: "api",
                title: "API Error",
                description: "Error interacting with the game panel API, please try again later"
            },
            {
                type: "ctx",
                title: "Context Error",
                description: `No context exists for guild "${interaction.guild.id}"`,
                log: `No context exists for guild ${interaction.guild.name} (${interaction.guild.id})`
            },
            // Power States
            {
                type: "server_offline",
                title: "Server Offline",
                description: "The server you are trying to perform an action on is offline"
            },
            {
                type: "server_already_offline",
                title: "Server Offline",
                description: "The server you are trying to stop is already offline"
            },
            {
                type: "server_already_online",
                title: "Server Online",
                description: "The server you are trying to start is already online"
            },
            
            // Server Actions
            {
                type: "stop_server",
                title: "Power Signal Error",
                description: "There was an error stopping the server, please try again later"
            },
            {
                type: "start_server",
                title: "Power Signal Error",
                description: "There was an error starting the server, please try again later"
            },
            {
                type: "restart_server",
                title: "Power Signal Error",
                description: "There was an error restarting the server, please try again later"
            },
            // Servers
            {
                type: "no_servers",
                title: "No Servers",
                description: "There were no servers found, please try again later"
            },
            {
                type: "no_players",
                title: "No Players",
                description: "No players found on the server"
            },
            {
                type: "no_players_query",
                title: "No Players Found",
                description: "No players found in your query"
            },
            // Backups
            {
                type: "backup_not_exist",
                title: "No Backup Found",
                description: "No backups found in your query"
            },
            {
                type: "backup_exist",
                title: "Backup Already Exists",
                description: "A backup was already found in your query"
            },
        ]
        const { title, description, log } = errors.find(error => error.type == type);
        if (log) {
            this.logger.error(log);
        }

        const embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor("RED");
        return interaction.editReply({ embeds: [embed] });
    }
}
