import { Router } from "express";
import { getUserIdFromRequest } from "../utils";

import FriendsRepository from "../repositories/FriendsRepository";
import authorize from "../middlewares/authorize";
import asyncHandler from "express-async-handler";
import FriendsValidator from "../validators/FriendsValidator";

const router = Router();

router.post(
  "/sendRequest",
  authorize(),
  ...FriendsValidator.sendFriendRequest,
  asyncHandler(async (req, res) => {
    const userId = getUserIdFromRequest(req);
    const { friendId } = req.body;

    await FriendsRepository.sendRequest(userId, friendId);

    res.json({
      data: { message: "Request sent successfully" },
    });
  })
);

router.get("/requests", authorize(), asyncHandler(async (req, res) => {
  const userId = getUserIdFromRequest(req);

  const requests = await FriendsRepository.getFriendsRequests(userId);

  res.json({
    data: { requests },
  });
}));

router.post(
  "/acceptRequest",
  authorize(),
  ...FriendsValidator.acceptFriendRequest,
  asyncHandler(async (req, res) => {
    const userId = getUserIdFromRequest(req);

    const { friendRequestId } = req.body;

    await FriendsRepository.acceptRequest(userId, friendRequestId);

    res.json({
      data: { message: "Friend request accepted!" },
    });
  })
);

export default router;
