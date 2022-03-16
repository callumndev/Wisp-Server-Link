const chalk = require("chalk");
const Config = require("./config");

module.exports = class Logger {
    #log = console.log;
    #config = Config;

    #colourMethod(method) {
        return chalk.bgMagenta(chalk.whiteBright(method));
    }

    #colourArgs(args, color) {
        return args.map(arg => {
            return typeof arg == "string" ? chalk[color](arg) : arg;
        })
    }

    debug(...args) {
        if (this.#config.debug) {
            this.#log(this.#colourMethod("DEBUG:"), ...this.#colourArgs(args, "magenta"));
        }
    }

    error(...args) {
        this.#log(this.#colourMethod("ERROR:"), ...this.#colourArgs(args, "redBright"));
    }
    
    warn(...args) {
        this.#log(this.#colourMethod("WARN:"), ...this.#colourArgs(args, "yellowBright"));
    }

    info(...args) {
        this.#log(this.#colourMethod("INFO:"), ...this.#colourArgs(args, "blueBright"));
    }
}
