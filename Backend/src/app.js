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
const allowedOrigins = [
  "http://localhost:5173",
  "https://www.codecrush.diy/",
  "https://code-crush-frontend.vercel.app",
  "https://code-crush-frontend-33n4pg4mg-aniket-ruparelias-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
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
