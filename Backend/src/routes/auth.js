const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const authrouter = express.Router();

authrouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, skills, age, gender, about } =
    req.body;
  try {
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
      secure: false, // true only in production (HTTPS)
      sameSite: "lax", // <- IMPORTANT
      maxAge: 86400000,
    });

    res.send(user);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

authrouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    if (!emailId || !password) throw new Error("Invalid credentials");
    const user = await User.findOne({ emailId });
    if (user) {
      const isPasswordCorrect = await user.verifyPassword(password);
      if (isPasswordCorrect) {
        const { firstName, lastName, age, skills, photoUrl } = user;
        const token = await user.generateJwt();
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 86400000,
        });
        res.send(user);
      } else {
        throw new Error("Invalid credentials");
      }
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    res.status(404).send(err.message);
  }
});

authrouter.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.send("user logged out successfully");
});

authrouter.delete("/deleteUser", async (req, res) => {
  const user_id = req.body.id;

  try {
    const user = await User.findByIdAndDelete(user_id);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = authrouter;
