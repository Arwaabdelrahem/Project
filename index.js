const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const products = require("./routes/products");
const orders = require("./routes/orders");
const users = require("./routes/users");
const cors = require("cors");
const { errorHandler, serverErrorHandler } = require("./middleware/error");
const app = express();

mongoose
  .connect(
    "mongodb+srv://Arwaabdelrahem:mongo@cluster0.xse5n.mongodb.net/MaxDB?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("MongoDB connected");
  });

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/products", products);
app.use("/orders", orders);
app.use("/users", users);
app.use(errorHandler);
app.use(serverErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server connected on port ${port}`);
});
