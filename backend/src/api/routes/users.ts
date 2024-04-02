import { Router } from "express";
import asyncHandler from "express-async-handler";

import UserRepository from "../repositories/UsersRepository";
import UsersValidator from "../validators/UsersValidator";

const router = Router();

router.get("/", ...UsersValidator.users, asyncHandler(async (req, res) => {
  const { search } = req.query;

  const users = await UserRepository.searchUsers(search as string);

  res.json({
    data: { users },
  });
}));

export default router;
