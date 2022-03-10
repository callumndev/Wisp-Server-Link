const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");

module.exports = class DataBase {
    constructor() {
        this._config = require("../config");
        this._sequelize = new Sequelize(this._config.dbDatabase, this._config.dbUsername, this._config.dbPassword, {
            host: this._config.dbHostname,
            port: this._config.dbPort,
            logging: false,
            dialect: "mysql"
        });

        this._models = new Map();
        const modelsPath = path.join(__dirname, "..", "models");
        const models = fs.readdirSync(modelsPath).map(model => ({
            name: model.replace(".js", ""),
            model: require(path.join(modelsPath, model))
        }));
        for (const model of models) {
            this._models.set(model.name, this._sequelize.define(model.name, model.model, {
                sequelize: this._sequelize,
                tableName: model.name,
                timestamps: false
            }));
            this._models.get(model.name).sync();
        }
    }

    get(model) {
        if (!this._models.has(model)) {
            throw `Unknown model "${model}"`;
        }
        return this._models.get(model);
    }
}
