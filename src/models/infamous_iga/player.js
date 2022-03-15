const { DataTypes } = require("sequelize");

module.exports = {
    SteamID: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
    },
    SteamName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Rank: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    TimePlayed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    FirstJoined: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    Vars: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}
