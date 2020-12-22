const express = require("express");
const router = express.Router();
const { Product, validate } = require("../models/product");
const upload = require("../multer");
const auth = require("../middleware/auth");
const cloud = require("../cloudinary");
const fs = require("fs");

router.get("/", async (req, res, next) => {
  const product = await Product.find({}).select("price name _id productImage");
  res.status(200).send(product);
});

router.post("/", auth, upload, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const result = await cloud.cloudUpload(req.file.path);
  if (!result) return res.status(500).send("Error while uploading");

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    productImage: result.productImage,
  });
  await product.save();
  fs.unlinkSync(req.file.path);
  res.status(201).send(product);
});

router.get("/:id", async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product Not Found.");

  res.status(200).send(product);
});

router.put("/:id", auth, upload, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const result = await cloud.cloudUpload(req.file.path);
  if (!result) return res.status(500).send("Error while uploading");

  let product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product Not Found.");

  product.name = req.body.name;
  product.price = req.body.price;
  product.productImage = result.productImage;
  product = await product.save();
  fs.unlinkSync(req.file.path);
  res.status(200).send(product);
});

router.delete("/:id", auth, async (req, res, next) => {
  const product = await Product.findByIdAndRemove(req.params.id);
  if (!product) return res.status(404).send("Product Not Found.");

  res.status(200).send(product);
});

module.exports = router;
