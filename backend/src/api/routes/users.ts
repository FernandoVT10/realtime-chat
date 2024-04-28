import { Router } from "express";
import { getUserIdFromRequest } from "../utils";

import asyncHandler from "express-async-handler";
import authorize from "../middlewares/authorize";
import UsersRepository from "../../repositories/UsersRepository";
import UsersValidator from "../validators/UsersValidator";

const router = Router();

router.get("/", authorize(), ...UsersValidator.users, asyncHandler(async (req, res) => {
  const { search } = req.query;

  const userId = getUserIdFromRequest(req);

  const users = await UsersRepository.searchUsers(search as string, userId);

  res.json({
    data: { users },
  });
}));

export default router;
