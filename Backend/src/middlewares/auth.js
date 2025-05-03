const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) return res.status(401).send("Unauthorized:Login Again");
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded_token._id);
    if (user) {
      req.user = user;
      next();
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
};

module.exports = { authenticateUser };
