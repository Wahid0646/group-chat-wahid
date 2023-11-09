const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const ArchivedChat = sequelize.define("archivedchats", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  message: {
    type: Sequelize.STRING,
  },
});

module.exports = ArchivedChat;
