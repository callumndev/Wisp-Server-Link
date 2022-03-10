const { Client, Intents, Constants } = require("discord.js");
const fs = require("fs");
const path = require("path");

function clientOptions(options) {
    if (Array.isArray(options.intents)) {
        options.intents = options.intents.map(intent => {
            if (!Intents.FLAGS[intent]) {
                throw `Unknown intent "${intent}"`;
            }

            return Intents.FLAGS[intent];
        })
    }
    return options;
}
module.exports = class Bot extends Client {
    constructor(options) {
        super(clientOptions(options));
        
        this.apiRoutes = new Map();
        this.services = new Map();
        this.subscribers = new Map();
        this.commands = new Map();
        
        this.logger = null;
        this.config = null;
        
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
        this.logger = this.services.get("logger");
        this.config = this.services.get("config");
        this.database = this.services.get("database");
        this.services.get("commands").register(this);
        if (servicesErrors.length) {
            this.logger.error("Error invoking services:", ...servicesErrors);
        }
        this.logger.debug(`Finished loading ${this.services.size} services`);


        // API Routes
        const apiRoutesPath = path.join(__dirname, "api-routes");
        const apiRoutesErrors = [];
        fs.readdirSync(apiRoutesPath).forEach(routeName => {
            let route = require(path.join(apiRoutesPath, routeName));
            try {
                route = new route(this);
            } catch (err) {
                apiRoutesErrors.push(err);
            }
            this.apiRoutes.set(route.apiRoute, route);
        })
        if (apiRoutesErrors.length) {
            this.logger.error("Error invoking routes:", ...apiRoutesErrors);
        }
        

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
                    if (this.config.get("enableDiscordJSDebug")) {
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
        this.login(this.services.get("config").get("token"));
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
}
