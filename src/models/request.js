const { DataTypes, Sequelize } = require("sequelize");

// review_message: review.id,
// review_channel: review.channel.id,
// //
// request_message: msg.id,
// request_channel: msg.channel.id

module.exports = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message: Sequelize.STRING,
    channel: Sequelize.STRING,
    requester: Sequelize.STRING,
    command: Sequelize.STRING,
    server: Sequelize.STRING,
}
