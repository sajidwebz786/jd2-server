const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const { v2: cloudinary } = require("cloudinary");
const requireAuth = require("../middleware/auth");
const { AdminUser, Category, Product, PageContent, QuoteRequest, Enquiry, MediaAsset } = require("../models");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "..", "uploads");
const useCloudinary = Boolean(process.env.CLOUDINARY_URL);

if (!useCloudinary && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (useCloudinary) {
  cloudinary.config({ secure: true });
}

const upload = multer({
  storage: useCloudinary ? multer.memoryStorage() : multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = slugify(path.basename(file.originalname, ext), { lower: true, strict: true });
      cb(null, `${Date.now()}-${base}${ext}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image uploads are allowed"));
    return cb(null, true);
  }
});

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const publicId = slugify(path.basename(file.originalname, path.extname(file.originalname)), { lower: true, strict: true });
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "jd2-meditech",
        public_id: `${Date.now()}-${publicId}`,
        resource_type: "image"
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
    stream.end(file.buffer);
  });
}

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
router.use("/categories", crud(Category));
router.use("/content", crud(PageContent));
router.use("/quotes", crud(QuoteRequest));
router.use("/enquiries", crud(Enquiry));

router.post("/media", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file is required" });
    if (useCloudinary) {
      const result = await uploadToCloudinary(req.file);
      const asset = await MediaAsset.create({
        title: req.body.title || req.file.originalname,
        filename: result.public_id,
        url: result.secure_url,
        mimeType: req.file.mimetype,
        size: req.file.size,
        altText: req.body.altText || "",
        folder: "cloudinary"
      });
      return res.status(201).json(asset);
    }

    const asset = await MediaAsset.create({
      title: req.body.title || req.file.originalname,
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      size: req.file.size,
      altText: req.body.altText || "",
      folder: "uploads"
    });
    return res.status(201).json(asset);
  } catch (error) {
    return res.status(500).json({ message: "Image upload failed", detail: error.message });
  }
});

router.get("/media", async (req, res) => res.json(await MediaAsset.findAll({ order: [["createdAt", "DESC"]] })));

module.exports = router;
