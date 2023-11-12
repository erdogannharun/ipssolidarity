const mySql = require("mysql2");
const config = require("../config");

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    dialect: "mysql",
    host: config.db.host,
    define: {
      timestamps: false,
    },
  }
);
async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log("sequelize başarıyla bağlandı");
  } catch (error) {
    console.log(error);
  }
}
connectDb();

module.exports = sequelize;

// let connection = mySql.createConnection(config.db);

// connection.connect((err) => {
//   if (err != null) {
//     return console.log(err);
//   }
//   console.log("mysql bağlantısı başarılı");
// });

// module.exports = connection.promise();
