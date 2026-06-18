const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { sequelize } = require("./models");
const bootstrapDefaults = require("./bootstrap");
const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");

const app = express();
const port = Number(process.env.PORT || 5000);
const configuredOrigins = [
  process.env.CLIENT_URL,
  process.env.ALLOWED_ORIGINS
].filter(Boolean).flatMap((value) => value.split(",").map((origin) => origin.trim()).filter(Boolean));
const allowedOrigins = new Set([
  ...configuredOrigins,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174"
]);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked origin: ${origin}`));
  }
}));
app.use(express.json({ limit: "5mb" }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "jd2-server" }));
app.post("/api/setup/bootstrap", async (req, res) => {
  if (!process.env.SETUP_SECRET) {
    return res.status(404).json({ message: "Setup endpoint is disabled" });
  }

  const providedSecret = req.headers["x-setup-secret"];
  if (providedSecret !== process.env.SETUP_SECRET) {
    return res.status(403).json({ message: "Invalid setup secret" });
  }

  await bootstrapDefaults();
  return res.json({ message: "Bootstrap complete" });
});
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

sequelize.authenticate()
  .then(() => sequelize.sync({ alter: true }))
  .then(() => bootstrapDefaults())
  .then(() => {
    app.listen(port, () => console.log(`JD2 API running on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error("Unable to start server", error);
    process.exit(1);
  });
