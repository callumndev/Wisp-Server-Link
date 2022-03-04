require("dotenv").config();

const Bot = require("./bot");
new Bot({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES"
    ]
});
