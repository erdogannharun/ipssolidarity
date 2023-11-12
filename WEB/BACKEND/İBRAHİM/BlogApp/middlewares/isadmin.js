module.exports = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.redirect("/account/login?returnUrl=" + req.originalUrl);
  }
  next();
};
