const chalk = require("chalk");

module.exports = class Logger {
    #log = console.log;

    #colourMethod(method) {
        return chalk.bgMagenta(chalk.whiteBright(method));
    }

    #colourArgs(args, color) {
        return args.map(arg => {
            return typeof arg == "string" ? chalk[color](arg) : arg;
        })
    }

    debug(...args) {
        if (process.env.DEBUG) {
            this.#log(this.#colourMethod("DEBUG:"), ...this.#colourArgs(args, "magenta"));
        }
    }

    error(...args) {
        this.#log(this.#colourMethod("ERROR:"), ...this.#colourArgs(args, "redBright"));
    }
    
    warn(...args) {
        this.#log(this.#colourMethod("WARN:"), ...this.#colourArgs(args, "yellowrBright"));
    }

    info(...args) {
        this.#log(this.#colourMethod("INFO:"), ...this.#colourArgs(args, "blueBright"));
    }
}
