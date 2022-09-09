const Logger = require("./logger");
const Config = require("./config");
const DataBase = require("./database");
const Utils = require("./utils");
const axios = require("axios");
const { Op } = require("sequelize");

module.exports = class ContextManager {
    logger = new Logger();
    config = Config;
    utils = new Utils();
    #guildID;
    #ctx;
    #db = new Map();
    #rconRequests;
    #staffUserGroups;
    #cachedServerData;
    #instance;

    static Create(guild) {
        if (!Object.hasOwnProperty.call(Config.context, guild)) {
            new Logger().error(`Unknown context guild ${guild}`);
            return null;
        }
        return new ContextManager(guild);
    }

    constructor(guild) {
        this.#guildID = guild;
        this.#ctx = this.config.context[this.#guildID];
        for (const db in this.#ctx.database) {
            if (Object.hasOwnProperty.call(this.#ctx.database, db)) {
                const element = this.#ctx.database[db];
                this.#db.set(db, new DataBase(element));
            }
        }
        this.#rconRequests = this.#ctx.rconRequests;
        this.#staffUserGroups = this.#ctx.staffUserGroups;
        this.#instance = axios.create({
            baseURL: `https://${this.#ctx.panelDomain}/api/client`,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/vnd.wisp.v1+json",
                "Authorization": `Bearer ${this.#ctx.apiKey}`
            }
        });
    }

    get guild() {
        return this.#guildID;
    }

    get server() {
        return this.#ctx.server;
    }

    getModel(database, model) {
        if (!this.#db.has(database)) {
            throw new Error(`Unknown database "${database}"`);
        }
        return this.#db.get(database).get(model);
    }

    get requestChannel() {
        return this.#rconRequests.requestChannel;
    }

    isRequestChannel(interaction) {
        return interaction.channelId == this.#rconRequests.requestChannel;
    }

    canAcceptRequest(member) {
        return this.#rconRequests.acceptorRoles.some(role => member.roles.cache.has(role));
    }

    isServerStaff(group) {
        return this.#staffUserGroups.includes(group);
    }

    async #fetchServerData(options = { includeAllocations: false, fetchResources: false }) {
        const url = `/servers/${this.#ctx.server}${options.includeAllocations ? "?include=allocations" : ""}`;

        let serverData = await this.#getRequest(url);
        if (!serverData || serverData.object != "server") {
            this.logger.warn("Server data did not return a server object", serverData);
            return null;
        }

        serverData = serverData.attributes;
        let server = {
            id: serverData.uuid_short,
            name: serverData.name
        }

        if (options.includeAllocations) {
            let allocations = serverData.relationships.allocations;
            if (!allocations || allocations.object != "list" || !Array.isArray(allocations.data)) {
                this.logger.warn("Allocations object did not return a allocation list")
                return null;
            }

            allocations = allocations.data;

            const allocation = allocations
                .filter(allocation => allocation.object == "allocation" && allocation.attributes)
                .map(allocation => allocation.attributes)
                .find(allocation => allocation.primary)
            if (!allocation) {
                this.logger.warn("Unable to find primary server allocation");
                return null;
            }

            server = Object.assign(server, {
                ip: [allocation.ip, allocation.port].join(":") || "Unknown"
            });
        }

        if (options.fetchResources) {
            let serverOnline = false;
            let players = [];
            let playerCount = 0;
            let maxPlayers = 0;
            let gamemode = "Unknown";
            let map = "Unknown";
            let memoryUsage = 0;
            let cpuUsage = 0;
            let diskUsage = 0;

            const resources = await this.#getRequest(`/servers/${this.#ctx.server}/resources`);
            if (resources.status == 1) {
                serverOnline = true;
            }

            if (Object.keys(resources.query).length != 0) {
                const queryPlayers = resources.query.players;
                if (Array.isArray(queryPlayers)) {
                    players = queryPlayers.map(player => ({
                        name: player.name,
                        timeConnected: this.utils.humanize(player.time, "seconds")
                    }))
                    playerCount = players.length;
                }

                const queryMaxPlayers = resources.query.maxplayers;
                if (!isNaN(queryMaxPlayers)) {
                    maxPlayers = queryMaxPlayers;
                }

                const queryGamemode = resources.query.gamemode;
                if (queryGamemode) {
                    gamemode = queryGamemode;
                }

                const queryMap = resources.query.map;
                if (queryMap) {
                    map = queryMap;
                }
            }

            if (Object.keys(resources.proc).length != 0) {
                const processMemoryUsage = resources.proc.memory.total;
                if (processMemoryUsage) {
                    memoryUsage = processMemoryUsage;
                }

                const processCpuUsage = resources.proc.cpu.total;
                if (processCpuUsage) {
                    cpuUsage = processCpuUsage;
                }

                const processDiskUsage = resources.proc.disk.used;
                if (processDiskUsage) {
                    diskUsage = processDiskUsage;
                }
            }

            server = Object.assign(server, {
                serverOnline, players, playerCount,
                maxPlayers, gamemode, map,
                memoryUsage, cpuUsage, diskUsage,
            });
        }

        this.#cachedServerData = server;
        return server;
    }

    clearServerDataCache() {
        this.#cachedServerData = null;
        return this;
    }

    async serverData(options) {
        return this.#cachedServerData || await this.#fetchServerData(options);
    }

    async #getRequest(endpoint) {
        try {
            const { data } = await this.#instance.get(endpoint);
            return data;
        } catch (err) {
            this.logger.error(`Error executing ctx GET request for endpoint "${endpoint}":`, err.message);
            return null;
        }
    }

    async #postRequest(endpoint, postData) {
        try {
            const { data, status } = await this.#instance.post(endpoint, postData);
            return { data, status };
        } catch (err) {
            this.logger.error(`Error executing POST request:`, err);
            return null;
        }
    }

    async rcon(command) {
        const rconRequest = await this.#postRequest(`/servers/${this.#ctx.server}/command`, { command });
        return rconRequest.status == 204;
    }

    async power(signal) {
        const rconRequest = await this.#postRequest(`/servers/${this.#ctx.server}/power`, { signal });
        return rconRequest.status == 204;
    }

    async account() {
        const accountRequest = await this.#getRequest("/auth/@me");
        if (accountRequest.object != "user") return null;

        const user = accountRequest.attributes;
        if (!user) return false;

        const flags = [
            user.root_admin && "Root Admin"
        ].filter(Boolean);

        return {
            name: `${user.name_first} ${user.name_last}`,
            email: user.email,
            flags
        }
    }

    async backups() {
        const backupsRequest = await this.#getRequest(`/servers/${this.#ctx.server}/backups`);
        if (backupsRequest.object != "list") return null;

        const backups = backupsRequest.data;
        if (!backups) return null;

        return backups.map((backup, i) => {
            if (backup.object != "backup") return;
            backup = backup.attributes;
            
            const description = [
                this.config.debug && { name: "UUID Short", value: backup.uuid_short },
                { name: "Size", value: this.utils.formatBytes(backup.bytes) },
                { name: "Created", value: `${this.utils.humanize(this.utils.dayjs(backup.created_at).diff(this.utils.dayjs(new Date()), "seconds"), "seconds")} ago` },
            ].filter(Boolean);

            return {
                name: `${i + 1}.) ${backup.name}`,
                value: description.map(desc => `**${desc.name}:** ${desc.value}`).join("\n"),
                inline: true,
                backupName: backup.name,
                backupID: backup.uuid_short
            }
        }).filter(Boolean);
    }

    async createBackup(name) {
        const createBackupRequest = await this.#postRequest(`/servers/${this.#ctx.server}/backups`, { name });
        return createBackupRequest.status == 200;
    }

    async deployBackup(backup) {
        const deployBackupRequest = await this.#postRequest(`/servers/${this.#ctx.server}/backups/${backup}/deploy`);
        return deployBackupRequest.status == 204;
    }

    async steamID(name) {
        const player = this.#db.get("main").get("player");
        const players = await player.findAll({
            where: {
                SteamName: {
                    [Op.regexp]: name.toLowerCase()
                }
            },
            limit: 10,
            raw: true
        });
        if (!players.length) return [];

        return players
            .sort((a, b) => b.TimePlayed - a.TimePlayed)
            .map(player => (
                {
                    steamName: player.SteamName,
                    steamID: player.SteamID,
                    timePlayed: this.utils.humanize(player.TimePlayed, "seconds"),
                    rank: `${player.Rank && this.isServerStaff(player.Rank) ? "(STAFF) " : ""}${player.Rank || "Unknown"}`
                }
            ))
    }
}
