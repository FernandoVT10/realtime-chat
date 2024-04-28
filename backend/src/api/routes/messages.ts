import { Router } from "express";
import { getUserIdFromRequest } from "../utils";

import authorize from "../middlewares/authorize";
import asyncHandler from "express-async-handler";
import MessageRepository from "../../repositories/MessageRepository";

const router = Router();

router.get("/", authorize(), asyncHandler(async (req, res) => {
  const userId = getUserIdFromRequest(req);

  const { friendId } = req.query;

  const messages = await MessageRepository.getMesssages(userId, String(friendId));

  res.json({
    data: { messages },
  });
}));

export default router;
