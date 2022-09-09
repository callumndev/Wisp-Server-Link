module.exports = {
    // Logging options
    debug: JSON.parse(process.env.DEBUG),
    enableDiscordJSDebug: JSON.parse(process.env.ENABLE_DISCORDJS_DEBUG),
    logInviteOnReady: JSON.parse(process.env.LOG_INVITE_ON_READY),
    
    // Bot options
    token: process.env.TOKEN,
    clientID: "948637146598756432",
    testingGuild: "948356210342658098",
    updateCommandsGloballyOnReady: JSON.parse(process.env.UPDATE_COMMANDS_GLOBALLY_ON_READY),
    updateCommandsTestingGuildOnReady: JSON.parse(process.env.UPDATE_COMMANDS_TESTING_GUILD_ON_READY),
    clearServerDataCacheCronTime: "*/5 * * * *",
    admins: [
        "204308161732149248", // Radon
        "373965085283975171", // Callum 1
        "948328329994453003", // Callum 2
        "528575084059688961", // Callum 3
    ],
    
    // WISP
    panelDomain: "infamousgaming.panel.gg",
    apiKey: process.env.API_KEY,
    context: {
        // Infamous Gaming
        "949636182495600660": {
            server: "b928940c",
            database: {
                main: {
                    hostname: process.env.IG_IGA_DB_HOSTNAME,
                    port: process.env.IG_IGA_DB_PORT,
                    username: process.env.IG_IGA_DB_USERNAME,
                    password: process.env.IG_IGA_DB_PASSWORD,
                    database: process.env.IG_IGA_DB_DATABASE
                }
            },
            rconRequests: {
                requestChannel: "949636183636443190",
                acceptorRoles: [
                    "949636182520778786", // owner
                    "949636182520778783" // bot dev
                ]
            },
            staffUserGroups: [
                "owner",
                "superadmin",
                "admin+",
                "admin",
                "moderator"
            ],
        },
        // Fractal Gaming
        "739776051093176401": {
            server: "5b753415",
            database: {
                main: {
                    hostname: process.env.FRACTAL_IGA_DB_HOSTNAME,
                    port: process.env.FRACTAL_IGA_DB_PORT,
                    username: process.env.FRACTAL_IGA_DB_USERNAME,
                    password: process.env.FRACTAL_IGA_DB_PASSWORD,
                    database: process.env.FRACTAL_IGA_DB_DATABASE
                }
            },
            rconRequests: {
                requestChannel: "828816551888945193",
                acceptorRoles: [
                    "805354695815725088", // owner
                    "805354696960114709" // bot dev
                ]
            },
            staffUserGroups: [
                "owner",
                "superadmin",
                "admin+",
                "admin",
                "moderator"
            ],
        }
    }
}
