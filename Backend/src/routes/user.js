const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const connectionRequestDb = require("../models/connectionRequest");
const user = require("../models/user");
const userRouter = express.Router();

//get all the connection request that are received

const SAFE_USER_DETAILS = "firstName lastName age skills about photoUrl";

userRouter.get(
  "/user/requests/received",
  authenticateUser,
  async (req, res) => {
    const loggedInUser = req.user;
    try {
      const connectionRequests = await connectionRequestDb
        .find({
          toUserId: loggedInUser._id,
          status: "interested",
        })
        .populate("fromUserId", SAFE_USER_DETAILS);

      res.send(connectionRequests);
    } catch (err) {
      res.send(err.message);
    }
  }
);

userRouter.get("/user/connections", authenticateUser, async (req, res) => {
  const loggedInUser = req.user;

  try {
    const connections = await connectionRequestDb
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", SAFE_USER_DETAILS)
      .populate("toUserId", SAFE_USER_DETAILS);

    const data = connections.map((connections) => {
      if (connections.fromUserId._id.toString() === loggedInUser._id.toString())
        return connections.toUserId;
      else return connections.fromUserId;
    });
    res.send(data);
  } catch (err) {
    res.send(err.message);
  }
});

userRouter.get("/feed", authenticateUser, async (req, res) => {
  const loggedInUser = req.user;
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * limit;

  try {
    const connectionRequest = await connectionRequestDb.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        { toUserId: loggedInUser._id },
      ],
    });

    const hideFromUserFeed = new Set();
    connectionRequest.forEach((req) => {
      hideFromUserFeed.add(req.fromUserId.toString());
      hideFromUserFeed.add(req.toUserId.toString());
    });

    const feed = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hideFromUserFeed) } },
          { _id: { $nin: loggedInUser._id } },
        ],
      })
      .select(SAFE_USER_DETAILS)
      .skip(skip)
      .limit(limit);

    res.send(feed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
