const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AdminUser = sequelize.define("AdminUser", {
  name: { type: DataTypes.STRING, allowNull: false, defaultValue: "JD2 Admin" },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false }
});

const Product = sequelize.define("Product", {
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  category: { type: DataTypes.STRING, allowNull: false },
  shortDescription: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT },
  specifications: { type: DataTypes.JSONB, defaultValue: [] },
  imageUrl: { type: DataTypes.STRING },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const PageContent = sequelize.define("PageContent", {
  page: { type: DataTypes.STRING, allowNull: false },
  section: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  eyebrow: { type: DataTypes.STRING },
  body: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.STRING },
  ctaLabel: { type: DataTypes.STRING },
  ctaUrl: { type: DataTypes.STRING },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  indexes: [{ unique: true, fields: ["page", "section"] }]
});

const QuoteRequest = sequelize.define("QuoteRequest", {
  organization: { type: DataTypes.STRING, allowNull: false },
  contactName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  productCategory: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.STRING },
  requirements: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "new" },
  response: { type: DataTypes.TEXT }
});

const Enquiry = sequelize.define("Enquiry", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  subject: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: "contact" },
  status: { type: DataTypes.STRING, defaultValue: "new" },
  response: { type: DataTypes.TEXT }
});

const MediaAsset = sequelize.define("MediaAsset", {
  title: { type: DataTypes.STRING, allowNull: false },
  filename: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false },
  mimeType: { type: DataTypes.STRING },
  size: { type: DataTypes.INTEGER },
  altText: { type: DataTypes.STRING },
  folder: { type: DataTypes.STRING, defaultValue: "uploads" }
});

module.exports = {
  sequelize,
  AdminUser,
  Product,
  PageContent,
  QuoteRequest,
  Enquiry,
  MediaAsset
};
