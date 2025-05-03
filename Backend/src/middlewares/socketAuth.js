const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../models/user");

async function socketAuth(socket) {
  const raw = socket?.handshake.headers.cookie || "";
  const cookies = cookie.parse(raw);
  const token = cookies.token;

  if (!token) {
    socket.emit("error", { message: "Authentication Required" });
    throw new Error("Authentication Required");
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    socket.emit("error", { message: "Authentication Required" });
    throw new Error("Authentication Required");
  }
  const user = await User.findById(decoded._id);
  if (!user) {
    socket.emit("error", { message: "User not found" });
    throw new Error("User not found");
  }

  socket.user = user;
}

module.exports = socketAuth;
