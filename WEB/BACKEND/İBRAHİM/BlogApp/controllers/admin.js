const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");
const fs = require("fs");
const slugfield = require("../helpers/slugfield");
const sequelize = require("../data/db");
const { name } = require("ejs");

module.exports.get_category_by_id = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findByPk(id);
    const blogs = await category.getBlogs();
    if (category) {
      res.render("admin/category-edit", {
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
  try {
    const body = req.body;
    const id = body.id;

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
    console.log(error);
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
    res.render("admin/category-create", {
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
    console.log(error);
  }
};

module.exports.get_category_list = async (req, res) => {
  try {
    const categories = await Category.findAll({ raw: true });

    res.render("admin/category-list", {
      categories: categories,
      title: "Admin Category List",
    });
  } catch (error) {
    console.log(error);
  }
};

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
      res.render("admin/blog-edit", {
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
    console.log(error);
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

    res.render("admin/blog-create", {
      title: "Blog Oluştur",
      categories: categories,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_create_blog = async (req, res) => {
  try {
    const newBlog = req.body;
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
    console.log(error);
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
    res.render("admin/blog-list", {
      blogs: blogs,
      title: "Admin Blog Listesi",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.get_roles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: [
        "id",
        "name",
        [sequelize.fn("COUNT", sequelize.col("users.id")), "userCount"],
      ],
      include: {
        model: User,
        attributes: [],
      },
      group: ["role.id"],
      raw: true,
      includeIgnoreAttribute: false,
    });
    res.render("admin/role-list", {
      roles: roles,
      title: "Admin Role Listesi",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.get_edit_roles = async (req, res) => {
  try {
    const id = req.params.id;

    var role = await Role.findByPk(id);
    var users = await role.getUsers();
    if (role) {
      res.render("admin/role-edit", {
        role: role,
        users: users,
        title: role.name + " Güncelleme",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_edit_roles = async (req, res) => {
  try {
    const id = req.body.id;

    var role = await Role.findByPk(id);

    if (role) {
      Role.update(
        {
          name: req.body.name,
        },
        {
          where: {
            id: id,
          },
        }
      );
      res.redirect("/admin/roles");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.remove_roles = async (req, res) => {
  try {
    const roleid = req.params.roleid;
    const userid = req.params.userid;
    const user = await User.findByPk(userid);
    const role = await Role.findByPk(roleid);
    if (user && role) {
      await user.removeRoles(role);
    }
    res.redirect(`/admin/roles/edit/${roleid}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports.get_users = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Role,
      },
    });
    if (users) {
      res.render("admin/user-list", {
        title: "Kullanıcı Listesi",
        users: users,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.get_assignRole = async (req, res) => {
  try {
    const id = req.params.id;

    let user = await User.findByPk(id);
    let userRoles = await user.getRoles();
    let roles = await Role.findAll();
    if (user) {
      res.render("admin/assign-role", {
        title: user.username + " Rol Ata",
        user: user,
        roles: roles,
        userRoles: userRoles,
        message: req.query.error,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_assignRole = async (req, res) => {
  try {
    const userid = req.body.userid;
    const selectedRoles = req.body.roles;
    console.log(selectedRoles);
    const user = await User.findOne({
      where: {
        id: userid,
      },
      include: {
        model: Role,
        attributes: ["id"],
      },
    });

    if (Array.isArray(selectedRoles)) {
      await user.removeRoles(user.roles);
      for (const roleId of selectedRoles) {
        const role = await Role.findByPk(roleId);
        await user.addRoles(role);
      }
      res.redirect("/admin/users");
    } else if (
      !Array.isArray(selectedRoles) &&
      typeof selectedRoles != "undefined"
    ) {
      await user.removeRoles(user.roles);
      const role = await Role.findByPk(1);
      await user.addRoles(role);
      res.redirect("/admin/users");
    } else {
      res.redirect(`/admin/users/assignrole/${user.id}?error=true`);
    }
  } catch (error) {
    console.log(error);
  }
};
