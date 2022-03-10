module.exports = class Servers {
    constructor() {
        this.apiRoute = "/servers?include=allocations";
    }

    async get() {
        const data = await this._getRequest(this.apiRoute);
        if (!data || data.object != "list" || !data.data.length) return false;
        
        const servers = await Promise.all(
            data.data.map(async serverObject => {
                if (serverObject.object != "server") return false;
    
                const server = serverObject.attributes;
                if (server.description.includes("SERVER_LINK_HIDE") || server?.relationships?.allocations?.object != "list" || !Array.isArray(server?.relationships?.allocations?.data)) return false;
                
                const primaryAllocation = server.relationships.allocations.data.find(allocation => allocation?.attributes?.primary)?.attributes;
                if (!primaryAllocation) return false;
                
                const serverResources = await this._getRequest(`/servers/${server.uuid_short}/resources`);
                if (!serverResources) return false;
                
                return {
                    id: server.uuid_short,
                    name: server.name,
                    ip: `${primaryAllocation.ip}:${primaryAllocation.port}`,
                    serverOnline: serverResources.status == 1,
                    players: serverResources.query && Array.isArray(serverResources.query.players) ? serverResources.query.players.map(player => ({
                        name: player.name,
                        timeConnected: player.time
                    })) : [],
                    playerCount: serverResources.query && Array.isArray(serverResources.query.players) ? serverResources.query.players.length : 0,
                    maxPlayers: serverResources.query && !isNaN(serverResources.query.maxplayers) ? serverResources.query.maxplayers : 0,
                    gamemode: serverResources?.query?.gamemode || "Unknown",
                    map: serverResources?.query?.map || "Unknown",
                    memoryUsage: serverResources?.proc?.memory?.total || 0,
                    cpuUsage: serverResources?.proc?.cpu?.total || 0,
                    diskUsage: serverResources?.proc?.disk?.used || 0,
                }
            })
        ).then(s => s.filter(Boolean))
        
        return servers;
    }
}
