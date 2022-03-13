module.exports = {
    // Logging options
    debug: 0,
    enableDiscordJSDebug: 0,
    logInviteOnReady: 0,

    // Bot options
    token: process.env.TOKEN,
    clientID: "948637146598756432",
    testingGuild: "948356210342658098",
    updateCommandsGloballyOnReady: 0,
    updateCommandsTestingGuildOnReady: 0,
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
            server: "c187b875",
            database: {
                hostname: process.env.IG_DB_HOSTNAME,
                port: process.env.IG_DB_PORT,
                username: process.env.IG_DB_USERNAME,
                password: process.env.IG_DB_PASSWORD,
                database: process.env.IG_DB_DATABASE
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
        // The Chill Networks
        "739776051093176401": {
            server: "c187b875",
            database: {
                hostname: process.env.IG_DB_HOSTNAME,
                port: process.env.IG_DB_PORT,
                username: process.env.IG_DB_USERNAME,
                password: process.env.IG_DB_PASSWORD,
                database: process.env.IG_DB_DATABASE
            }
        },
        // Infamous Gaming
        "949636182495600660": {
            server: "75910468",
            database: {
                hostname: process.env.IG_DB_HOSTNAME,
                port: process.env.IG_DB_PORT,
                username: process.env.IG_DB_USERNAME,
                password: process.env.IG_DB_PASSWORD,
                database: process.env.IG_DB_DATABASE
            }
        }
    }
}
