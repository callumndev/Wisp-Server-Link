module.exports = class Config {
    constructor() {
        this._config = require("../config");
    }

    get(key) {
        if (!Object.prototype.hasOwnProperty.call(this._config, key)) {
            throw `Unknown config key "${key}"`;
        }
        return this._config[key];
    }
}
