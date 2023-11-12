const nodemailer = require("nodemailer");
const config = require("../config");

var transporter = nodemailer.createTransport({
  host: config.email.host,
  from: config.email.from,
  secure: false,
  port: 587,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: config.email.username,
    pass: config.email.password,
  },
});

module.exports = transporter;
