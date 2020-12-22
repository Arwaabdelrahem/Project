const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const Product = require("./product");

const orderSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const Order = mongoose.model("Order", orderSchema);

function orderValidation(order) {
  const schema = Joi.object({
    productId: Joi.objectId().required(),
    quantity: Joi.number(),
  });

  return schema.validate(order);
}
module.exports.Order = Order;
module.exports.validate = orderValidation;
