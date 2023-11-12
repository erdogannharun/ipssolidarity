const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.get("/register", authController.get_register);
router.post("/register", authController.post_register);

router.get("/login", authController.get_login);
router.post("/login", authController.post_login);

router.get("/reset-password", authController.get_resetpassword);
router.post("/reset-password", authController.post_resetpassword);

router.get("/changepassword/:token", authController.get_changepassword);
router.post("/changepassword/:token", authController.post_changepassword);

router.get("/logout", authController.get_logout);

module.exports = router;
