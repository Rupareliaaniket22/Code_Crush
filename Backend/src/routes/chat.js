const express = require("express");
const { Chat } = require("../models/chatModel");
const { authenticateUser } = require("../middlewares/auth");
const mongoose = require("mongoose");

const chatRouter = express.Router();

chatRouter.get("/chats/:toUserId", authenticateUser, async (req, res) => {
  const { toUserId } = req.params;

  try {
    if (!req.user || !toUserId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const chat = await Chat.findOne({
      participants: {
        $all: [req.user._id, new mongoose.Types.ObjectId(toUserId)],
      },
    });

    res.json(chat || { messages: [] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch chat" });
  }
});

module.exports = { chatRouter };
