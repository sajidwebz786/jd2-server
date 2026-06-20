const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const bcrypt = require("bcryptjs");
const { sequelize, AdminUser } = require("./models");

async function checkAdminUsers() {
  await sequelize.authenticate();

  const admins = await AdminUser.findAll({
    attributes: ["id", "name", "email", "passwordHash", "createdAt", "updatedAt"],
    order: [["id", "ASC"]]
  });

  const configuredPassword = process.env.ADMIN_PASSWORD || "";
  const users = await Promise.all(admins.map(async (admin) => ({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    passwordHashPrefix: admin.passwordHash.slice(0, 7),
    passwordHashLength: admin.passwordHash.length,
    matchesConfiguredAdminPassword: configuredPassword
      ? await bcrypt.compare(configuredPassword, admin.passwordHash)
      : null,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt
  })));

  console.log(JSON.stringify({
    configuredAdminEmail: process.env.ADMIN_EMAIL || null,
    configuredAdminPasswordPresent: Boolean(configuredPassword),
    adminUserCount: users.length,
    users
  }, null, 2));
}

checkAdminUsers()
  .catch((error) => {
    console.error(`${error.name}: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close().catch(() => {});
  });
