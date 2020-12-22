const Joi = require("joi");
const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
  })
);

function productValidation(product) {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.string().required(),
    productImage: Joi.string(),
  });

  return schema.validate(product);
}
module.exports.Product = Product;
module.exports.validate = productValidation;
