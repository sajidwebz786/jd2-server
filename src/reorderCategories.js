const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { sequelize, Category } = require("./models");

const order = [
  "ortho-implants", "patient-monitor", "radiology", "hospital-furniture",
  "sterility-disinfection", "cardiology", "anesthesia", "ventilators",
  "respiratory-care", "defibrillators"
];

async function reorder() {
  await sequelize.authenticate();
  for (const [index, key] of order.entries()) {
    await Category.update({ sortOrder: index + 1 }, { where: { key } });
  }
  await sequelize.close();
  console.log("Category order updated");
}

reorder().catch((error) => {
  console.error(error);
  process.exit(1);
});
