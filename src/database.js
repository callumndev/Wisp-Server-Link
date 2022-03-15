const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

module.exports = class DataBase {
    #sequelize;
    #models = new Map();

    constructor({ hostname, port, username, password, database }) {
        this.#sequelize = new Sequelize(database, username, password, {
            host: hostname,
            port: port,
            logging: false,
            dialect: "mysql"
        });

        const modelsPath = path.join(__dirname, "models", database);
        const models = fs.readdirSync(modelsPath).map(model => ({
            name: model.replace(".js", ""),
            model: require(path.join(modelsPath, model))
        }));
        for (const model of models) {
            this.#models.set(model.name, this.#sequelize.define(model.name, model.model, {
                sequelize: this.#sequelize,
                tableName: model.name,
                timestamps: false
            }));
            this.#models.get(model.name).sync();
        }
    }

    get(model) {
        if (!this.#models.has(model)) {
            throw new Error(`Unknown model "${model}"`);
        }
        return this.#models.get(model);
    }
}
