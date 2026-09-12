const bcrypt = require("bcryptjs");
const { AdminUser, Category, Product, PageContent } = require("./models");
const { categories, products, content } = require("./seedData");

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

  for (const category of categories) {
    await Category.findOrCreate({ where: { key: category.key }, defaults: category });
  }

  for (const product of products) {
    await Product.findOrCreate({ where: { slug: product.slug }, defaults: product });
  }

  for (const item of content) {
    await PageContent.findOrCreate({ where: { page: item.page, section: item.section }, defaults: item });
  }

  // Seed managed collections once. Deleted items stay deleted after a restart.
  for (const collection of ["marquee", "reviews"]) {
    const marker = { page: "system", section: `${collection}-initialized` };
    if (!(await PageContent.findOne({ where: marker }))) {
      await PageContent.sequelize.transaction(async (transaction) => {
        const defaults = require(`../data/${collection}.json`);
        for (const item of defaults) {
          await PageContent.findOrCreate({ where: { page: item.page, section: item.section }, defaults: item, transaction });
        }
        await PageContent.create({ ...marker, title: `${collection} initialized`, active: false }, { transaction });
      });
    }
  }
}

module.exports = bootstrapDefaults;
