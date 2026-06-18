const bcrypt = require("bcryptjs");
const { AdminUser, Product, PageContent } = require("./models");
const { products, content } = require("./seedData");

async function bootstrapDefaults() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [admin, created] = await AdminUser.findOrCreate({
    where: { email },
    defaults: { name: "JD2 Admin", passwordHash }
  });
  if (!created) {
    await admin.update({ passwordHash });
  }

  for (const product of products) {
    await Product.findOrCreate({ where: { slug: product.slug }, defaults: product });
  }

  for (const item of content) {
    await PageContent.findOrCreate({ where: { page: item.page, section: item.section }, defaults: item });
  }
}

module.exports = bootstrapDefaults;
