require("dotenv").config();
const { sequelize } = require("./models");
const bootstrapDefaults = require("./bootstrap");

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  await bootstrapDefaults();
  console.log("Seed complete");
  await sequelize.close();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
