const express = require("express");
const { AllowedUpdates } = require("../utils/validation");
const { authenticateUser } = require("../middlewares/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const profilerouter = express.Router();
profilerouter.get("/profile", authenticateUser, (req, res) => {
  const user = req.user;
  console.log(user);
  try {
    if (!user) throw new Error("unauthorized");
    res.send("hello" + user.firstName + user.lastName);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

profilerouter.get("/profile/view", authenticateUser, (req, res) => {
  const user = req.user;
  try {
    if (!user) throw new Error("unauthorized");
    res.send(user);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

profilerouter.patch("/editProfile", authenticateUser, async (req, res) => {
  const user_id = req.user._id;
  const edited_data = req.body;
  console.log("Getting it");
  try {
    AllowedUpdates(edited_data);

    const user = await User.findByIdAndUpdate(user_id, edited_data, {
      new: true,
      runValidators: true,
    });

    res.send(user);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

profilerouter.patch("/editPassword", authenticateUser, async (req, res) => {
  const user = req.user;
  const currentPassword = req.body.currentPassword;
  const updatedPassword = req.body.updatedPassword;

  try {
    if (!currentPassword || !user) throw new Error("Something went Wrong");

    const iscurrentPassworldValid = await user.verifyPassword(currentPassword);
    if (!iscurrentPassworldValid) {
      throw new Error("Password is incorrect");
    } else {
      user.password = await bcrypt.hash(updatedPassword, 10);
      await user.save();
      res.send("password updated successfully");
    }
  } catch (err) {
    res.status(404).send(err.message);
  }
});
module.exports = profilerouter;
