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
    staffUserGroups: [
        "owner",
        "superadmin",
        "admin+",
        "admin",
        "moderator"
    ],
    requestChannel: "950168317375688775",
    requestAcceptRoles: [
        "950169491545927731"
    ],

    // WISP
    panelDomain: "infamousgaming.panel.gg",
    apiKey: process.env.API_KEY,
    guilds: [
        {
            id: "948356210342658098",
            server: "c187b875"
        },
        {
            id: "739776051093176401",
            server: "c187b875"
        },
        {
            id: "949636182495600660",
            server: "75910468"
        },
    ],

    // DataBase
    dbHostname: process.env.DB_HOSTNAME,
    dbPort: process.env.DB_PORT,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbDatabase: process.env.DB_DATABASE,
}
