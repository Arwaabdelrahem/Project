const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("authentication-token");
  if (!token) return res.status(401).send("access denied.. token not found");

  try {
    const decoded = jwt.verify(token, process.env.jwtprivateKey);
    req.userData = decoded;
    next();
  } catch (error) {
    res.status(400).send("invalid token");
  }
};
