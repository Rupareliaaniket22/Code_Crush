const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { authenticateUser } = require("../middlewares/auth");
const authrouter = express.Router();
const validatorHelper = require("validator");

// Detect if we are in production
const isProduction = process.env.NODE_ENV === "production";

// SIGNUP
authrouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, skills, age, gender, about } =
    req.body;

  try {
    if (!validatorHelper.isStrongPassword(password)) {
      return res.status(400).send("Password is not strong enough");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      skills,
      age,
      about,
      gender,
    });

    const token = await user.generateJwt();

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // true in production (HTTPS)
      sameSite: isProduction ? "None" : "Lax", // cross-site requires "None"
      maxAge: 86400000, // 1 day
    });

    res.send(user);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

// LOGIN
authrouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    if (!emailId || !password) throw new Error("Invalid credentials");

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("User not found");

    const isPasswordCorrect = await user.verifyPassword(password);
    if (!isPasswordCorrect) throw new Error("Invalid credentials");

    const token = await user.generateJwt();

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 86400000,
    });

    res.send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

// LOGOUT
authrouter.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });

  res.send("User logged out successfully");
});

// DELETE USER (authenticated route)
authrouter.delete("/deleteUser", authenticateUser, async (req, res) => {
  const user_id = req.body.id;

  try {
    await User.findByIdAndDelete(user_id);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = authrouter;
