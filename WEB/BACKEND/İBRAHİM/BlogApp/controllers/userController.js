const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");
const fs = require("fs");
const slugfield = require("../helpers/slugfield");
const sequelize = require("../data/db");
const { name } = require("ejs");

module.exports.blogs_by_category = async (req, res) => {
  try {
    const size = 5;
    const { page = 0 } = req.query;
    const slug = req.params.slug;
    const category = await Category.findAll({
      where: {
        slug: slug,
      },
      raw: true,
    });
    if (category) {
      const categories = await Category.findAll();
      const { rows: blogs, count } = await Blog.findAndCountAll({
        where: {
          categoryId: category[0].id,
        },
        raw: true,
        limit: size,
        offset: page * size,
      });
      console.log(blogs);
      return res.render("users/blogs", {
        title: category.name,
        blogs: blogs,
        categories: categories,
        selectedId: category[0].id,
        blogCount: count,
        page: page,
        totalPages: Math.ceil(count / size),
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.blog_by_slug = async (req, res) => {
  const slug = req.params.slug;

  const blog = await Blog.findOne({
    where: {
      slug: slug,
    },
  });
  if (blog) {
    return res.render("users/blog-detail", {
      blog: blog,
      title: blog.title + " - BlogApp",
    });
  }
  res.redirect("/");
};

module.exports.blog_list = async (req, res) => {
  try {
    const size = 5;
    const { page = 0 } = req.query;
    const { rows: blogs, count } = await Blog.findAndCountAll({
      raw: true,
      limit: size,
      offset: page * size,
    });
    const category = await Category.findAll({ raw: true });

    return res.render("users/blogs", {
      blogs: blogs,
      categories: category,
      title: "Bloglar",
      selectedId: null,
      page: page,
      totalPages: Math.ceil(count / size),
      blogCount: count,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.blog_list_by_homepage = async (req, res, next) => {
  try {
    const size = 5;
    const { page = 0 } = req.query;
    const { rows: blogs, count } = await Blog.findAndCountAll({
      where: {
        homepage: 1,
      },
      raw: true,
      limit: size,
      offset: page * size,
    });
    const category = await Category.findAll({ raw: true });
    return res.render("users/", {
      blogs: blogs,
      categories: category,
      title: "ANASAYFA",
      selectedId: null,
      page: page,
      totalPages: Math.ceil(count / size),
      blogCount: count,
      isAuth: req.session.isAuth,
    });
  } catch (error) {
    console.log(error);
  }
};
