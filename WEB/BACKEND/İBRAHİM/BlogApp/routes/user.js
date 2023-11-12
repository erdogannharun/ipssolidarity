const express = require("express");
const path = require("path");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/blogs/category/:slug", userController.blogs_by_category);

router.get("/blogs/:slug", userController.blog_by_slug);

router.get("/blogs/", userController.blog_list);

router.get("/", userController.blog_list_by_homepage);
module.exports = router;
