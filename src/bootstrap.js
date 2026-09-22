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
    const matchesConfigured = await bcrypt.compare(password, admin.passwordHash);
    if (!matchesConfigured) {
      await admin.update({ passwordHash });
    }
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
    if (collection === "reviews") {
      const defaults = require("../data/reviews.json");
      const legacySections = ["procurement-team", "orthopedic-team", "healthcare-administrator"];

      // Convert the three original anonymous review records into the first
      // three named hospital testimonials. This keeps an upgraded site at 15
      // editable reviews instead of displaying the three legacy entries plus
      // 15 new ones.
      for (const [index, legacySection] of legacySections.entries()) {
        const defaultReview = defaults[index];
        const namedReview = await PageContent.findOne({
          where: { page: "reviews", section: defaultReview.section }
        });
        const legacyReview = await PageContent.findOne({
          where: { page: "reviews", section: legacySection }
        });

        if (!namedReview && legacyReview && !legacyReview.hospitalName) {
          await legacyReview.update({
            section: defaultReview.section,
            title: defaultReview.title,
            hospitalName: defaultReview.hospitalName,
            eyebrow: defaultReview.eyebrow,
            body: defaultReview.body,
            sortOrder: defaultReview.sortOrder,
            active: defaultReview.active
          });
        }
      }

      // Keep missing default review records available after an update, while
      // preserving Admin edits because findOrCreate never overwrites them.
      for (const item of defaults) {
        await PageContent.findOrCreate({ where: { page: item.page, section: item.section }, defaults: item });
      }
    }
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
