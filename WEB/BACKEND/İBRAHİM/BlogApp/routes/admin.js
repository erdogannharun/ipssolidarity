const express = require("express");
const router = express.Router();

const imageUpload = require("../helpers/image-upload");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const blogController = require("../controllers/blogController");
const categoryController = require("../controllers/categoryController");

const isAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isadmin");

const { db } = require("../config");

router.get(
  "/categories/edit/:id",
  isAdmin,
  isAuth,
  categoryController.get_category_by_id
);

router.post(
  "/categories/edit",
  isAdmin,
  isAuth,
  categoryController.post_category_by_id
);

router.get(
  "/categories/remove/:id",
  isAuth,
  categoryController.remove_category_by_id
);

router.get(
  "/categories/create",
  isAdmin,
  isAuth,
  categoryController.get_create_category
);

router.post(
  "/categories/create",
  isAdmin,
  isAuth,
  categoryController.post_create_category
);

router.get(
  "/categories",
  isAdmin,
  isAuth,
  categoryController.get_category_list
);

router.get("/blogs/edit/:id", isAdmin, isAuth, blogController.get_update_blog);

router.post(
  "/blogs/edit",
  isAdmin,
  imageUpload.upload.single("image"),
  blogController.post_update_blog
);

router.get(
  "/blogs/remove/:id",
  isAdmin,
  isAuth,
  blogController.remove_blog_by_id
);

router.get("/blogs/create", isAdmin, isAuth, blogController.get_create_blog);
router.post(
  "/blogs/create",
  isAdmin,
  imageUpload.upload.single("image"),
  blogController.post_create_blog
);

router.get("/blogs", isAdmin, isAuth, blogController.get_blog_list);

router.get(
  "/roles/users/remove/:userid/:roleid",
  isAdmin,
  isAuth,
  adminController.remove_roles
);
router.get("/roles/edit/:id", isAdmin, isAuth, adminController.get_edit_roles);
router.post("/roles/edit", isAdmin, isAuth, adminController.post_edit_roles);

router.get("/roles", isAdmin, isAuth, adminController.get_roles);

router.get(
  "/users/assignrole/:id",
  isAdmin,
  isAuth,
  adminController.get_assignRole
);
router.post(
  "/users/assignrole",
  isAdmin,
  isAuth,
  adminController.post_assignRole
);
router.get("/users", isAdmin, isAuth, adminController.get_users);

module.exports = router;
