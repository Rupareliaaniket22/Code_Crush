const express = require("express");
const { databaseConnect } = require("./config/database");
const authrouter = require("./routes/auth");
const profilerouter = require("./routes/profile");
const { default: mongoose } = require("mongoose");
const connectionRequestRouter = require("./routes/request");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");
const app = express();

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
databaseConnect().then(app.listen(3000));
