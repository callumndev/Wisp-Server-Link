const { debug } = require("../config");
const chalk = require("chalk");

module.exports = class Logger {
    _log(...args) {
        console.log(...args)
    }

    _colourMethod(method) {
        return chalk.bgMagenta(chalk.whiteBright(method));
    }

    _colourArgs(args, color) {
        return args.map(arg => {
            return typeof arg == "string" ? chalk[color](arg) : arg;
        })
    }

    debug(...args) {
        if (debug) {
            this._log(this._colourMethod("DEBUG:"), ...this._colourArgs(args, "magenta"));
        }
    }

    error(...args) {
        this._log(this._colourMethod("ERROR:"), ...this._colourArgs(args, "redBright"));
    }

    info(...args) {
        this._log(this._colourMethod("INFO:"), ...this._colourArgs(args, "blueBright"));
    }
}
