const express = require("express");
const { Category, Product, PageContent, QuoteRequest, Enquiry } = require("../models");

const router = express.Router();

router.get("/products", async (req, res) => {
  const where = { active: true };
  if (req.query.category) where.category = req.query.category;
  const products = await Product.findAll({ where, order: [["sortOrder", "ASC"], ["name", "ASC"]] });
  res.json(products);
});

router.get("/categories", async (req, res) => {
  const categories = await Category.findAll({
    where: { active: true },
    order: [["sortOrder", "ASC"], ["label", "ASC"]]
  });
  res.json(categories);
});

router.get("/content", async (req, res) => {
  const content = await PageContent.findAll({
    where: { active: true },
    order: [["page", "ASC"], ["sortOrder", "ASC"]]
  });
  res.json(content);
});

router.post("/quotes", async (req, res) => {
  const quote = await QuoteRequest.create(req.body);
  res.status(201).json({ message: "Quote request submitted", quote });
});

router.post("/enquiries", async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  res.status(201).json({ message: "Message submitted", enquiry });
});

module.exports = router;
