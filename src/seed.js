const bcrypt = require("bcryptjs");
require("dotenv").config();
const { sequelize, AdminUser, Product, PageContent } = require("./models");
const { products, content } = require("./seedData");

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  const email = process.env.ADMIN_EMAIL || "admin@jd2meditech.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(password, 10);
  await AdminUser.findOrCreate({ where: { email }, defaults: { name: "JD2 Admin", passwordHash } });

  for (const product of products) {
    await Product.findOrCreate({ where: { slug: product.slug }, defaults: product });
  }
  for (const item of content) {
    await PageContent.findOrCreate({ where: { page: item.page, section: item.section }, defaults: item });
  }

  console.log("Seed complete");
  await sequelize.close();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
