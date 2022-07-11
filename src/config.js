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
        // callumn.dev's bot testing server
        "948356210342658098": {
            server: "ce98c5f9",
            database: {
                darkrp: {
                    hostname: process.env.IG_DARKRP_DB_HOSTNAME,
                    port: process.env.IG_DARKRP_DB_PORT,
                    username: process.env.IG_DARKRP_DB_USERNAME,
                    password: process.env.IG_DARKRP_DB_PASSWORD,
                    database: process.env.IG_DARKRP_DB_DATABASE
                },
                main: {
                    hostname: process.env.IG_IGA_DB_HOSTNAME,
                    port: process.env.IG_IGA_DB_PORT,
                    username: process.env.IG_IGA_DB_USERNAME,
                    password: process.env.IG_IGA_DB_PASSWORD,
                    database: process.env.IG_IGA_DB_DATABASE
                },
                server: {
                    hostname: process.env.IG_SERVER_DB_HOSTNAME,
                    port: process.env.IG_SERVER_DB_PORT,
                    username: process.env.IG_SERVER_DB_USERNAME,
                    password: process.env.IG_SERVER_DB_PASSWORD,
                    database: process.env.IG_SERVER_DB_DATABASE
                },
                token: {
                    hostname: process.env.IG_TOKEN_DB_HOSTNAME,
                    port: process.env.IG_TOKEN_DB_PORT,
                    username: process.env.IG_TOKEN_DB_USERNAME,
                    password: process.env.IG_TOKEN_DB_PASSWORD,
                    database: process.env.IG_TOKEN_DB_DATABASE
                },
            },
            rconRequests: {
                requestChannel: "950168317375688775",
                acceptorRoles: [
                    "950169491545927731"
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
        // Infamous Gaming
        "949636182495600660": {
            server: "ce98c5f9",
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
        }
    }
}
