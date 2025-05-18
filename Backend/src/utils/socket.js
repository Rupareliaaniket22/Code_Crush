const socketIo = require("socket.io");
const crypto = require("crypto");
const connectionRequestdb = require("../models/connectionRequest");
const { Chat } = require("../models/chatModel");
const mongoose = require("mongoose");
const socketAuth = require("../middlewares/socketAuth");

function createSecureRoomId(fromUserId, toUserId) {
  const ids = [fromUserId, toUserId].sort().join("_");
  return crypto.createHash("sha256").update(ids).digest("hex");
}

const socket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://www.codecrush.diy",
        "https://code-crush-frontend.vercel.app",
      ],
      credentials: true,
    },
    path: "/socket.io",
  });

  io.on("connection", async (socket) => {
    console.log("A user connected");

    let userId = null;
    try {
      // Authenticate socket and extract user
      await socketAuth(socket);
      userId = socket.user._id.toString();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      return socket.disconnect();
    }

    socket.on("joinRoom", ({ fullName, toUserId }) => {
      try {
        const roomId = createSecureRoomId(userId, toUserId);
        socket.join(roomId);
      } catch (err) {
        console.error("Join room error:", err.message);
        socket.emit("error", { message: err.message });
      }
    });

    socket.on("sendMessage", async ({ toUserId, text }) => {
      try {
        const fromUserId = userId;
        const roomId = createSecureRoomId(fromUserId, toUserId);

        // Ensure users are connected
        const isConnection = await connectionRequestdb.findOne({
          $or: [
            { fromUserId, toUserId, status: "accepted" },
            { fromUserId: toUserId, toUserId: fromUserId, status: "accepted" },
          ],
        });
        if (!isConnection) {
          return socket.emit("error", { message: "You are not connected" });
        }

        // Save message to DB
        let chat = await Chat.findOne({
          participants: { $all: [fromUserId, toUserId] },
        });
        const newMessage = { senderId: fromUserId, receiverId: toUserId, text };
        if (!chat) {
          chat = new Chat({
            participants: [fromUserId, toUserId],
            messages: [newMessage],
          });
        } else {
          chat.messages.push(newMessage);
        }
        await chat.save();

        // Emit to room
        io.to(roomId).emit("receiveMessage", {
          fromUserId,
          text,
          timeStamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Send message error:", err.message);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
};

module.exports = { socket };
