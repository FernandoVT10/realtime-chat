import { Router } from "express";
import { getUserIdFromRequest } from "../utils";

import authorize from "../middlewares/authorize";
import asyncHandler from "express-async-handler";
import MessageRepository from "../../repositories/MessageRepository";

const router = Router();

router.get("/", authorize(), asyncHandler(async (req, res) => {
  const userId = getUserIdFromRequest(req);

  const { friendId } = req.query;

  const offset = parseInt(String(req.query.offset)) || 0;

  const pagination = await MessageRepository.getMessagesPagination(userId, String(friendId), offset);

  res.json({
    data: pagination,
  });
}));

export default router;
