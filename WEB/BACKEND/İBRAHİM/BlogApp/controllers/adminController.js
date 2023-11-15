const Role = require("../models/role");
const User = require("../models/user");
const sequelize = require("../data/db");

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
    return res.render("admin/role-list", {
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
      return res.render("admin/role-edit", {
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
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let message = "";
      for (let e of error.errors) {
        message += e.message + "</br>";
      }
      return res.render("admin/role-list", {
        title: "Rol Güncelleme",
        message: message,
      });
    }
    res.redirect("/error");
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
      return res.render("admin/user-list", {
        title: "Kullanıcı Listesi",
        users: users,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.get_assignRole = async (req, res) => {
  const id = req.params.id;

  let user = await User.findByPk(id);
  let userRoles = await user.getRoles();
  let roles = await Role.findAll();
  try {
    if (user) {
      return res.render("admin/assign-role", {
        title: user.username + " Rol Ata",
        user: user,
        roles: roles,
        userRoles: userRoles,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_assignRole = async (req, res) => {
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
  const roles = await Role.findAll();
  try {
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
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let message = "";
      for (let e of error.errors) {
        message += e.message + "</br>";
      }
      return res.render("admin/assign-role", {
        title: user.username + " Rol Ata",
        user: user,
        roles: roles,
        userRoles: userRoles,
        message: message,
      });
    }
    res.redirect("/error");
  }
};
