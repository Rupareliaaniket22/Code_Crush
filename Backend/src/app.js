const express = require("express");
const { databaseConnect } = require("./config/database");
const authrouter = require("./routes/auth");
const profilerouter = require("./routes/profile");
const { default: mongoose } = require("mongoose");
const connectionRequestRouter = require("./routes/request");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");
const http = require("http");
const app = express();
const { socket } = require("./utils/socket");
const server = http.createServer(app);
const io = socket(server);
const { chatRouter } = require("./routes/chat");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

//let user signup
app.use("/", authrouter);
app.use("/", profilerouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
databaseConnect().then(() => {
  server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
