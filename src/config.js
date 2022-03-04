module.exports = {
    // Logging options
    debug: 0,
    enableDiscordJSDebug: 0,
    logInviteOnReady: 1,
    
    // Bot options
    token: process.env.TOKEN,
    clientID: "948637146598756432",
    testingGuild: "948356210342658098",
    updateCommandsOnReady: 0,
    admins: [
        "204308161732149248", // Radon
        "373965085283975171", // Callum 1
        "948328329994453003", // Callum 2
        "528575084059688961", // Callum 3
    ],
    // WISP
    panelDomain: "infamousgaming.panel.gg",
    apiKey: process.env.API_KEY,
    guilds: [
        {
            id: "948356210342658098",
            server: "c187b875"
        }
    ]
}
