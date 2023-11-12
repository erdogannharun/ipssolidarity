const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Role = sequelize.define("role", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Role;
