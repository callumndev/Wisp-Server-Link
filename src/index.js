try { require("dotenv").config(); } catch (error) { }

const Bot = require("./bot");
new Bot({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES"
    ]
});
