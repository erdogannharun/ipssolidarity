const User = require("../models/user");
const bcrypt = require("bcrypt");
const mailService = require("../helpers/send-mail");
const config = require("../config");
const crypto = require("crypto");
const Role = require("../models/role");

module.exports.get_register = async (req, res) => {
  try {
    return res.render("auth/register", {
      title: "Kullanıcı Kayıt Sayfası",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_register = async (req, res) => {
  try {
    const body = req.body;

    var newUser = await User.create({
      username: body.username,
      email: body.email,
      password: body.password,
    });
    let role = await Role.findByPk(2);
    await newUser.addRoles(role);
    return res.redirect("/account/login");
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let message = "";
      for (let e of error.errors) {
        message += e.message + "</br>";
      }
      return res.render("auth/register", {
        title: "Kullanıcı Kayıt Sayfası",
        message: message,
      });
    }
    res.redirect("/error");
  }
};

module.exports.get_login = async (req, res) => {
  try {
    return res.render("auth/login", {
      title: "Kullanıcı Giriş Sayfası",
      returnUrl: req.query.returnUrl,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_login = async (req, res) => {
  try {
    const body = req.body;
    const returnUrl = body.returnUrl;
    const user = await User.findOne({
      where: {
        email: body.email,
      },
      include: {
        model: Role,
        attributes: ["name"],
      },
    });
    console.log(user.roles);
    let userRoles = new Array();
    user.roles.forEach((role) => {
      userRoles.push(role.name);
    });
    console.log(userRoles);
    if (!user) {
      return res.render("auth/login", {
        title: "Kullanıcı Giriş Sayfası",
        message: "Email yada şifre hatalı",
      });
    } else {
      if (await bcrypt.compare(body.password, user.password)) {
        req.session.isAuth = true;
        req.session.userid = user.id;
        req.session.isAdmin = userRoles.includes("Admin") ? true : false;
        if (returnUrl) return res.redirect(returnUrl);
        else return res.redirect("/");
      } else {
        return res.render("auth/login", {
          title: "Kullanıcı Giriş Sayfası",
          message: "Email yada şifre hatalı",
        });
      }
    }
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let message = "";
      for (let e of error.errors) {
        message += e.message + "</br>";
      }
      return res.render("auth/login", {
        title: "Kullanıcı Giriş Sayfası",
        message: message,
      });
    }
    res.redirect("/error");
  }
};

module.exports.get_resetpassword = async (req, res) => {
  try {
    return res.render("auth/reset-password", {
      title: "Parola Yenileme Sayfası",
    });
  } catch (error) {
    let message = "";
    for (let e of error.errors) {
      message += e.message + "</br>";
    }
    return res.render("auth/register", {
      title: "Parola Yenileme Sayfası",
      message: message,
    });
  }
};
module.exports.post_resetpassword = async (req, res) => {
  const email = req.body.email;
  try {
    var token = await crypto.randomBytes(32).toString("hex");
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 1000 * 60 * 3;
      await user.save();

      mailService.sendMail({
        from: config.email.from,
        to: email,
        subject: "Şifre Yenileme İsteği",
        html:
          "<div class='container'>Şifrenizi yenilemek için <a href='http://127.0.0.1:5000/account/changepassword/" +
          user.resetToken +
          "'>tıklayın</a>. <p>Eğer bunu yapanın siz olmadığını düşünüyorsanız lütfen iletişime geçin.</p></div>",
      });
    }
    return res.render("auth/reset-password", {
      title: "Şifre Yenileme",
      message:
        email +
        " mailine kayıtlı bir kullanıcı varsa şifre sıfırlama linki gönderilecektir.",
    });
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let message = "";
      for (let e of error.errors) {
        message += e.message + "</br>";
      }
      return res.render("auth/reset-password", {
        title: "Şifre Yenileme",
        message: message,
      });
    }
    res.redirect("/error");
  }
};

module.exports.get_changepassword = async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      where: {
        resetToken: token,
      },
    });
    if (token) {
      if (user) {
        return res.render("auth/changepassword", {
          title: "Şifreni Yenile",
          email: user.email,
          token: token,
        });
      } else {
        return res.render("auth/changepassword", {
          title: "Şifreni Yenile",
          email: "Kullanıcı bulunamadı.",
          message: "Kullanıcı bulunamadı.",
          token: token,
        });
      }
    }
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_changepassword = async (req, res) => {
  try {
    const token = req.params.token;
    const password = req.body.password;
    const user = await User.findOne({
      where: {
        resetToken: token,
      },
    });
    if (user) {
      if (user.resetTokenExpiration >= Date.now()) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        return res.render("auth/login", {
          title: "Kullanıcı Giriş Sayfası",
          message: "Şifreniz başarıyla değiştirildi. Giriş yapabilirsiniz",
        });
      } else {
        return res.render("auth/changepassword", {
          message: "Tokenin süresi doldu. Yenisini talep edin.",
          title: "Şifreni Yenile",
          token: token,
        });
      }
    }
    return res.render("auth/changepassword", {
      message: "Kullanıcı bulunamadı.",
      title: "Şifreni Yenile",
      token: token,
    });
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let message = "";
      for (let e of error.errors) {
        message += e.message + "</br>";
      }
      return res.render("auth/changepassword", {
        title: "Şifreni Yenile",
        message: message,
      });
    }
    res.redirect("/error");
  }
};

module.exports.get_logout = async (req, res) => {
  try {
    await req.session.destroy();
    return res.redirect("/account/login");
  } catch (error) {
    console.log(error);
  }
};
