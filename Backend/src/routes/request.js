const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const connectionRequestRouter = express.Router();
const connectionRequestdb = require("../models/connectionRequest");

connectionRequestRouter.post(
  "/request/send/:status/:toUserId",
  authenticateUser,
  async (req, res) => {
    const user = req.user;
    const fromUserId = user._id;
    const toUserId = req.params.toUserId;
    const AllowedStatus = ["ignored", "interested"];
    const status = req.params?.status?.toLowerCase();
    try {
      if (!AllowedStatus.includes(status)) {
        throw new Error("Bad request operation not allowed");
      }

      const isDuplicateRequest = await connectionRequestdb.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isDuplicateRequest) throw new Error("Request already present");
      const newRequest = new connectionRequestdb({
        fromUserId,
        toUserId,
        status,
      });
      await newRequest.save();
      res.send(
        `connection request ${status}  here are the details ${newRequest}  `
      );
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

connectionRequestRouter.post(
  "/request/review/:status/:requestId",
  authenticateUser,
  async (req, res) => {
    const { user } = req;
    const { status, requestId } = req.params;
    const allowedStatus = ["accepted", "rejected"];

    try {
      if (!allowedStatus.includes(status)) {
        throw new Error("Status Not Allowed");
      }

      const connectionRequest = await connectionRequestdb.findOne({
        _id: requestId,
        toUserId: user._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Connection Request Not Found");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();
      res.status(200).json({
        message: "Connection request " + status,
        data,
        success: true,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

module.exports = connectionRequestRouter;
