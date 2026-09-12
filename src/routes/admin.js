const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
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

function normalizeCloudinaryFolder(value) {
  const parts = String(value || "images")
    .replace(/\\/g, "/")
    .split("/")
    .map((part) => slugify(part, { lower: true, strict: true }))
    .filter(Boolean);
  return parts.join("/") || "images";
}

function uploadToCloudinary(file, requestedFolder = "images") {
  return new Promise((resolve, reject) => {
    const publicId = slugify(path.basename(file.originalname, path.extname(file.originalname)), { lower: true, strict: true });
    const folder = normalizeCloudinaryFolder(requestedFolder);
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
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

function crud(model, options = {}) {
  const api = express.Router();
  if (options.validate) api.use(async (req, res, next) => {
    if (!["POST", "PUT"].includes(req.method)) return next();
    try { await options.validate(req.body, req.params); return next(); }
    catch (error) { return res.status(400).json({ message: error.message }); }
  });
  api.get("/", async (req, res) => res.json(await model.findAll({ order: [["createdAt", "DESC"]] })));
  api.post("/", async (req, res) => {
    try { return res.status(201).json(await model.create(req.body)); }
    catch (error) { return res.status(error.name === "SequelizeUniqueConstraintError" ? 409 : 400).json({ message: "Unable to save. Check required fields and use a unique key." }); }
  });
  api.put("/:id", async (req, res) => {
    try {
    const item = await model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    await item.update(req.body);
    return res.json(item);
    } catch (error) { return res.status(error.name === "SequelizeUniqueConstraintError" ? 409 : 400).json({ message: "Unable to update. Check required fields and use a unique key." }); }
  });
  api.delete("/:id", async (req, res) => {
    const item = await model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    if (options.beforeDelete) await options.beforeDelete(item);
    await item.destroy();
    return res.json({ message: "Deleted" });
  });
  return api;
}

router.use("/products", crud(Product, {
  beforeDelete: async (product) => MediaAsset.update({ productId: null }, { where: { productId: product.id } })
}));
router.use("/categories", crud(Category));
router.use("/content", crud(PageContent, {
  validate: async (body) => {
    if (!["marquee", "reviews"].includes(body.page)) return;
    if (typeof body.title !== "string" || !body.title.trim() || typeof body.section !== "string" || !body.section.trim()) throw new Error("Title and unique section key are required.");
    if (body.page === "marquee") {
      if (typeof body.imageUrl !== "string" || !/^(https:\/\/|\/(?!\/))/.test(body.imageUrl)) throw new Error("Use an HTTPS or local image URL.");
      if (typeof body.ctaUrl !== "string" || !/^\/products(?:\/[a-z0-9-]+)*(?:\?[^\s]*)?$/.test(body.ctaUrl)) throw new Error("Use a product link such as /products/ortho-implants.");
    }
    if (body.page === "reviews" && (typeof body.body !== "string" || !body.body.trim())) throw new Error("Review text is required.");
  }
}));
router.use("/quotes", crud(QuoteRequest));
router.use("/enquiries", crud(Enquiry));

router.post("/media", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file is required" });
    const fileBytes = useCloudinary ? req.file.buffer : fs.readFileSync(req.file.path);
    const checksum = crypto.createHash("md5").update(fileBytes).digest("hex");
    const duplicate = await MediaAsset.findOne({ where: { checksum } });
    if (duplicate) {
      if (!useCloudinary && req.file.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(409).json({ message: "This image already exists in the gallery", asset: duplicate });
    }
    if (useCloudinary) {
      const result = await uploadToCloudinary(req.file, req.body.folder);
      const asset = await MediaAsset.create({
        title: req.body.title || req.file.originalname,
        filename: result.public_id,
        url: result.secure_url,
        mimeType: req.file.mimetype,
        size: req.file.size,
        altText: req.body.altText || "",
        folder: normalizeCloudinaryFolder(req.body.folder),
        checksum
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
      folder: "uploads",
      checksum
    });
    return res.status(201).json(asset);
  } catch (error) {
    return res.status(500).json({ message: "Image upload failed", detail: error.message });
  }
});

router.post("/media/bulk", upload.array("images", 50), async (req, res) => {
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ message: "At least one image file is required" });

  const uploaded = [];
  const skipped = [];
  const failed = [];
  for (const file of files) {
    try {
      const fileBytes = useCloudinary ? file.buffer : fs.readFileSync(file.path);
      const checksum = crypto.createHash("md5").update(fileBytes).digest("hex");
      const duplicate = await MediaAsset.findOne({ where: { checksum } });
      if (duplicate) {
        if (!useCloudinary && file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        skipped.push({ name: file.originalname, reason: "duplicate", asset: duplicate });
        continue;
      }

      let values;
      if (useCloudinary) {
        const result = await uploadToCloudinary(file, req.body.folder);
        values = {
          title: file.originalname, filename: result.public_id, url: result.secure_url,
          mimeType: file.mimetype, size: file.size, altText: "", folder: normalizeCloudinaryFolder(req.body.folder), checksum
        };
      } else {
        values = {
          title: file.originalname, filename: file.filename, url: `/uploads/${file.filename}`,
          mimeType: file.mimetype, size: file.size, altText: "", folder: "uploads", checksum
        };
      }
      uploaded.push(await MediaAsset.create(values));
    } catch (error) {
      failed.push({ name: file.originalname, reason: error.message });
    }
  }
  return res.status(uploaded.length ? 201 : 200).json({ uploaded, skipped, failed });
});

async function syncCloudinaryGallery() {
  if (!useCloudinary) return;
  let nextCursor;
  do {
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      max_results: 500,
      ...(nextCursor ? { next_cursor: nextCursor } : {})
    });
    for (const resource of result.resources || []) {
    const publicIdFolder = path.posix.dirname(resource.public_id);
    const resourceFolder = resource.asset_folder || (publicIdFolder === "." ? "images" : publicIdFolder);
    const cloudChecksum = resource.etag || null;
    const existing = await MediaAsset.findOne({
      where: cloudChecksum
        ? { [require("sequelize").Op.or]: [{ filename: resource.public_id }, { checksum: cloudChecksum }] }
        : { filename: resource.public_id }
    });
    if (existing) {
      const updates = {};
      if (existing.url !== resource.secure_url) updates.url = resource.secure_url;
      if (existing.folder !== resourceFolder) updates.folder = resourceFolder;
      if (Object.keys(updates).length) await existing.update(updates);
      continue;
    }
    await MediaAsset.findOrCreate({
      where: { filename: resource.public_id },
      defaults: {
        title: path.basename(resource.public_id),
        url: resource.secure_url,
        mimeType: `image/${resource.format}`,
        size: resource.bytes,
        altText: "",
        folder: resourceFolder,
        checksum: cloudChecksum
      }
    });
    }
    nextCursor = result.next_cursor;
  } while (nextCursor);
}

router.get("/media", async (req, res) => {
  try {
    await syncCloudinaryGallery();
    return res.json(await MediaAsset.findAll({ order: [["createdAt", "DESC"]] }));
  } catch (error) {
    return res.status(500).json({ message: "Unable to load Cloudinary gallery", detail: error.message });
  }
});

router.get("/media-folders", async (req, res) => {
  try {
    const assets = await MediaAsset.findAll({ attributes: ["folder"] });
    const folders = [...new Set(assets.map((asset) => asset.folder).filter(Boolean))].sort();
    return res.json(folders);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load Cloudinary folders", detail: error.message });
  }
});

router.post("/media/:id/attach", async (req, res) => {
  const asset = await MediaAsset.findByPk(req.params.id);
  const product = await Product.findByPk(req.body.productId);
  if (!asset || !product) return res.status(404).json({ message: "Image or product not found" });
  if (asset.productId && asset.productId !== product.id) return res.status(409).json({ message: "This image is already attached to another product" });
  const existing = await MediaAsset.findOne({ where: { productId: product.id } });
  if (existing && existing.id !== asset.id) return res.status(409).json({ message: "This product already has a Cloudinary image attached" });
  await asset.update({ productId: product.id });
  await product.update({ imageUrl: asset.url });
  return res.json({ asset, product });
});

router.post("/media/:id/detach", async (req, res) => {
  const asset = await MediaAsset.findByPk(req.params.id);
  if (!asset) return res.status(404).json({ message: "Image not found" });
  const product = asset.productId ? await Product.findByPk(asset.productId) : null;
  if (product && product.imageUrl === asset.url) await product.update({ imageUrl: null });
  await asset.update({ productId: null });
  return res.json({ asset, product });
});

module.exports = router;
