const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const Category = require("./models/category");
const Blog = require("./models/blog");
const User = require("./models/user");
const Role = require("./models/role");

const sequelize = require("./data/db");
const app = express();

app.use(cookieParser());
app.use(
  session({
    secret: "testsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use((req, res, next) => {
  res.locals.isAuth = req.session.isAuth;
  res.locals.userid = req.session.userid;
  res.locals.isAdmin = req.session.isAdmin;
  next();
});

//one to many ilişki tipi uygulanması
Category.hasMany(Blog, { onDelete: "CASCADE", hooks: true });
Blog.belongsTo(Category);

Blog.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
});
User.hasMany(Blog);

Role.belongsToMany(User, {
  onDelete: "CASCADE",
  hooks: true,
  through: "userRoles",
});
User.belongsToMany(Role, { through: "userRoles" });

(async () => {
  await sequelize.sync({ force: true });
})();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(express.static("node_modules"));
app.use(express.static("public"));

app.use("/account", authRoutes);
app.use("/admin", adminRoutes);
app.use(userRoutes);

app.listen(5000, () => {
  console.log("listening on port 5000");
});
