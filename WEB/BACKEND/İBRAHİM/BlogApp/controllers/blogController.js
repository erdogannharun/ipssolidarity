const Blog = require("../models/blog");
const Category = require("../models/category");
const fs = require("fs");
const slugfield = require("../helpers/slugfield");
const sequelize = require("../data/db");
const { name } = require("ejs");

module.exports.get_update_blog = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = await Blog.findOne({
      where: {
        id: id,
      },
      include: {
        model: Category,
      },
    });

    if (updatedData) {
      const category = await Category.findByPk(updatedData.categoryId, {
        raw: true,
      });
      const categories = await Category.findAll({ raw: true });
      return res.render("admin/blog-edit", {
        blog: updatedData,
        title: updatedData.title,
        category: category,
        categories: categories,
      });
    } else {
      res.redirect("/admin/blogs");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_update_blog = async (req, res) => {
  try {
    const body = req.body;
    const id = body.blogid;
    const updatedData = await Blog.findByPk(id);
    console.log(updatedData);
    console.log(req.body);
    await Blog.update(
      {
        title: body.title,
        description: body.description,
        imagePath: req.file == null ? updatedData.imagePath : req.file.filename,
        homepage: body.homepage == "on" ? 1 : 0,
        categoryId: body.category,
        slug:
          body.title == updatedData.title
            ? updatedData.slug
            : slugfield(body.title),
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (req.file) {
      fs.unlink("./public/images/" + updatedData.imagePath, (err) => {
        console.log(err);
      });
    }
    res.redirect("/admin/blogs");
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
      res.redirect("/error");
    }
  }
};

module.exports.remove_blog_by_id = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(typeof removedBlog);
    await Blog.destroy({
      where: {
        id: id,
      },
    });
    res.redirect("/admin/blogs");
  } catch (error) {
    console.log(error);
  }
};

module.exports.get_create_blog = async (req, res) => {
  try {
    const categories = await Category.findAll({ raw: true });

    return res.render("admin/blog-create", {
      title: "Blog Oluştur",
      categories: categories,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_create_blog = async (req, res) => {
  const categories = await Category.findAll({ raw: true });
  try {
    const newBlog = req.body;
    if (!req.file) {
      return res.render("admin/blog-create", {
        title: "Blog Oluştur",
        message: "Lütfen bir resim seçin.",
        categories: categories,
      });
    }
    const result = await Blog.create({
      title: newBlog.title,
      description: newBlog.description,
      imagePath: req.file.filename,
      homepage: newBlog.homepage == "on" ? 1 : 0,
      categoryId: parseInt(newBlog.category),
      slug: slugfield(newBlog.title),
      userId: req.session.userid,
    });
    res.redirect("/blogs/" + result.slug);
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let message = "";
      for (let e of error.errors) {
        message += e.message + "</br>";
      }
      return res.render("admin/blog-create", {
        title: "Blog Oluştur",
        message: message,
        categories: categories,
      });
    }
    console.log(error);
    res.redirect("/error");
  }
};

module.exports.get_blog_list = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: {
        model: Category,
      },
    });
    const categories = await Category.findAll({ raw: true });
    return res.render("admin/blog-list", {
      blogs: blogs,
      title: "Admin Blog Listesi",
    });
  } catch (error) {
    console.log(error);
  }
};
