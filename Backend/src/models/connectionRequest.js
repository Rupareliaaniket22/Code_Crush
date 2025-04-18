const mongoose = require("mongoose");
const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["accepted", "rejected", "ignored", "interested"],
    },
  },
  { timestamps: true }
);
connectionRequest.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
connectionRequest.pre("save", function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You can't send a connection request to yourself.");
  }
});
module.exports = mongoose.model("connectionRequest", connectionRequest);
