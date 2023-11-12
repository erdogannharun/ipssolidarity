const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Kullanıcı adı zaten alınmış.",
      },
      validate: {
        notEmpty: {
          msg: "Kullanıcı adı boş geçilemez.",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email zaten kullanılıyor.",
      },
      validate: {
        isEmail: {
          msg: "Geçerli bir email formatı girin.",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Şifre boş geçilemez.",
        },
        len: {
          args: [6, 100],
          msg: "Şifre en az 6 karakter olmalıdır.",
        },
      },
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;
