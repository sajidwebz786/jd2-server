const { Sequelize } = require("sequelize");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const useSsl = process.env.DB_SSL === "true" || isProduction || Boolean(process.env.RENDER);

const commonOptions = {
  dialect: "postgres",
  logging: false,
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : {}
};

if (!process.env.DATABASE_URL) {
  const missing = ["DB_NAME", "DB_USER", "DB_PASSWORD", "DB_HOST"].filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      `Missing database environment variables: ${missing.join(", ")}. ` +
      "Create jd2-server/.env for local development, or set DATABASE_URL in Render."
    );
  }
}

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, commonOptions)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        ...commonOptions,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432)
      }
    );

module.exports = sequelize;
