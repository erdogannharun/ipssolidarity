const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Blog = sequelize.define("blog", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Başlık boş geçilemez.",
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    validate: {
      notEmpty: {
        msg: "Açıklama boş geçilemez.",
      },
    },
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  homepage: {
    type: DataTypes.BOOLEAN,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
module.exports = Blog;
