import { Router } from "express";
import { getUserIdFromRequest } from "../utils";
import asyncHandler from "express-async-handler";
import multer from "multer";

import UserRepository from "../../repositories/UserRepository";
import UserValidator from "../validators/UserValidator";
import authorize from "../middlewares/authorize";

//20 MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const router = Router();

router.post("/create", ...UserValidator.createUser, asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  await UserRepository.createUser({ username, password });

  res.json({
    data: { message: "User created successfully" },
  });
}));

router.post("/login", ...UserValidator.login, asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const token = await UserRepository.getAuthToken({ username, password });

  res.json({
    data: { token },
  });
}));

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    files: 10,
    fileSize: MAX_FILE_SIZE,
  },
});

router.post(
  "/updateAvatar",
  authorize(),
  upload.single("avatar"),
  ...UserValidator.updateAvatar,
  asyncHandler(
    async (req, res) => {
      // the validator assures you that req.file exists
      const avatar = req.file as Express.Multer.File;
      const userId = getUserIdFromRequest(req);

      await UserRepository.updateAvatar(userId, avatar);

      res.json({
        data: { message: "Avatar updated successfully" },
      });
    }
  )
);

router.get("/profile", authorize(), asyncHandler(async (req, res) => {
  const userId = getUserIdFromRequest(req);

  const data = await UserRepository.getUserProfile(userId);

  res.json({ data });
}));

export default router;
