const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const slugify = require("slugify");
const requireAuth = require("../middleware/auth");
const { AdminUser, Product, PageContent, QuoteRequest, Enquiry, MediaAsset } = require("../models");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "..", "uploads");

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = slugify(path.basename(file.originalname, ext), { lower: true, strict: true });
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

const upload = multer({ storage });

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await AdminUser.findOne({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "8h" });
  res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
});

router.use(requireAuth);

router.get("/dashboard", async (req, res) => {
  const [products, quotes, enquiries, media] = await Promise.all([
    Product.count(),
    QuoteRequest.count(),
    Enquiry.count(),
    MediaAsset.count()
  ]);
  res.json({ products, quotes, enquiries, media });
});

function crud(model) {
  const api = express.Router();
  api.get("/", async (req, res) => res.json(await model.findAll({ order: [["createdAt", "DESC"]] })));
  api.post("/", async (req, res) => res.status(201).json(await model.create(req.body)));
  api.put("/:id", async (req, res) => {
    const item = await model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    await item.update(req.body);
    return res.json(item);
  });
  api.delete("/:id", async (req, res) => {
    const item = await model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    await item.destroy();
    return res.json({ message: "Deleted" });
  });
  return api;
}

router.use("/products", crud(Product));
router.use("/content", crud(PageContent));
router.use("/quotes", crud(QuoteRequest));
router.use("/enquiries", crud(Enquiry));

router.post("/media", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Image file is required" });
  const asset = await MediaAsset.create({
    title: req.body.title || req.file.originalname,
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
    mimeType: req.file.mimetype,
    size: req.file.size,
    altText: req.body.altText || "",
    folder: "uploads"
  });
  res.status(201).json(asset);
});

router.get("/media", async (req, res) => res.json(await MediaAsset.findAll({ order: [["createdAt", "DESC"]] })));

module.exports = router;
