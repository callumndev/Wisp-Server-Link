const { DataTypes, Sequelize } = require("sequelize");

module.exports = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message: Sequelize.STRING,
    command: Sequelize.STRING,
}
