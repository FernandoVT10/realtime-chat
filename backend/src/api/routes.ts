import { Router } from "express";
import asyncHandler from "express-async-handler";

import UserRepository from "./repositories/UserRepository";
import UserValidator from "./validators/UserValidator";

const router = Router();

router.post("/user/create", ...UserValidator.createUser, asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  await UserRepository.createUser({ username, password });

  res.json({
    data: { message: "User created successfully" },
  });
}));

router.post("/user/login", ...UserValidator.login, asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const token = await UserRepository.getAuthToken({ username, password });

  res.json({
    data: { token },
  });
}));

export default router;
