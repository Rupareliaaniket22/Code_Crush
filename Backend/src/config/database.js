const { mongoose } = require("mongoose");
require("dotenv").config();

async function databaseConnect() {
  const connect = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("database connected");
}

module.exports = { databaseConnect };
