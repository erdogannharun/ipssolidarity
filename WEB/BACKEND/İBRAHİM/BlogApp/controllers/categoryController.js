const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");
const fs = require("fs");
const slugfield = require("../helpers/slugfield");
const sequelize = require("../data/db");
const { name } = require("ejs");

module.exports.get_category_by_id = async (req, res) => {
  const id = req.params.id;
  const category = await Category.findByPk(id);
  const blogs = await category.getBlogs();
  try {
    if (category) {
      return res.render("admin/category-edit", {
        title: category.name + " Güncelle",
        category: category,
        blogs: blogs,
        countBlog: await category.countBlogs(),
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_category_by_id = async (req, res) => {
  const id = req.body.id;
  const category = await Category.findByPk(id);
  const blogs = await category.getBlogs();
  try {
    const body = req.body;
    await Category.update(
      { name: body.name, slug: slugfield(body.name) },
      {
        where: {
          id: id,
        },
      }
    );
    res.redirect("/admin/categories");
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let message = "";
      for (let e of error.errors) {
        message += e.message + "</br>";
      }
      return res.render("admin/category-edit", {
        title: category.name + " Güncelle",
        category: category,
        blogs: blogs,
        countBlog: await category.countBlogs(),
        message: message,
      });
    }
    res.redirect("/error");
  }
};

module.exports.remove_category_by_id = async (req, res) => {
  const id = req.params.id;
  await Category.destroy({
    where: {
      id: id,
    },
  });
  res.redirect("/admin/categories");
};

module.exports.get_create_category = async (req, res) => {
  try {
    return res.render("admin/category-create", {
      title: "Kategori Oluştur",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_create_category = async (req, res) => {
  try {
    const body = req.body;
    await Category.create({
      name: body.name,
      slug: slugfield(body.name),
    });
    res.redirect("/admin/categories");
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let message = "";
      for (let e of error.errors) {
        message += e.message + "</br>";
      }
      return res.render("admin/category-create", {
        title: "Kategori Oluştur",
        message: message,
      });
    }
    res.redirect("/error");
  }
};

module.exports.get_category_list = async (req, res) => {
  try {
    const categories = await Category.findAll({ raw: true });

    return res.render("admin/category-list", {
      categories: categories,
      title: "Admin Category List",
    });
  } catch (error) {
    console.log(error);
  }
};
