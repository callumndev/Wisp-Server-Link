const tableConfig = {
	border: {
		topBody: `─`,
		topJoin: `┬`,
		topLeft: `┌`,
		topRight: `┐`,

		bottomBody: `─`,
		bottomJoin: `┴`,
		bottomLeft: `└`,
		bottomRight: `┘`,

		bodyLeft: `│`,
		bodyRight: `│`,
		bodyJoin: `│`,

		joinBody: `─`,
		joinLeft: `├`,
		joinRight: `┤`,
		joinJoin: `┼`
	},
	singleLine: true
}

module.exports = class Utils {
    dayjs = require("dayjs");
    #pluralize = require("pluralize");
    #table = require("table").table;
    
    constructor() {
        this.dayjs.extend(require("dayjs/plugin/duration"));
        this.dayjs.extend(require("dayjs/plugin/relativeTime"));
    }
    
    humanize(time, unit) {
        return this.dayjs.duration(time, unit).humanize();
    }
    
    formatBytes(bytes) {
        if (bytes == 0) return "0b";
        
        const k = 1024;
        const sizes = ["b", "kb", "mb", "gb", "tb"];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + (sizes[i] ? sizes[i].toUpperCase() : "unknown");
    }
    
    findByKey(map, searchValue) {
        for (let [key, value] of map.entries()) {
            if (key == searchValue || key instanceof RegExp && key.test(searchValue)) return value;
        }
        return null;
    }
    
    createInteractionCollector(message, { filter, time = 60000, max = 0 }) {
        return new Promise(resolve => {
            let collector = message.createMessageComponentCollector({ filter, time, max });
            collector.on("end", collected => resolve(max == 1 ? collected.first() : collected))
        });
    }

    pluralize(word, count) {
        return this.#pluralize(word, count);
    }

    table(data, config) {
        return this.#table(data, Object.assign(tableConfig, config));
    }
}
