const express = require("express");
const router = express.Router();
const { Order, validate } = require("../models/order");
const { Product } = require("../models/product");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res, next) => {
  const order = await Order.find({}).populate("product");
  res.status(200).send(order);
});

router.post("/", auth, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(404).send("Product Not Found.");

  const order = new Order({
    product: req.body.productId,
    quantity: req.body.quantity,
  });

  try {
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/:id", auth, async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("product");
  if (!order) return res.status(404).send("Order Not found");

  res.status(200).send(order);
});

router.put("/:id", auth, async (req, res, next) => {
  let order = await Order.findById(req.params.id);
  if (!order) return res.status(404).send("Order Not Found.");

  order.quantity = req.body.quantity;
  order = await order.save();
  res.status(200).send(order);
});

router.delete("/:id", auth, async (req, res, next) => {
  const order = await Order.findByIdAndRemove(req.params.id);
  if (!order) return res.status(404).send("Order Not Found.");

  res.status(200).send(order);
});

module.exports = router;
