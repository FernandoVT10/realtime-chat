import { Router, Request } from "express";
import asyncHandler from "express-async-handler";
import multer from "multer";

import UserRepository from "./repositories/UserRepository";
import UserValidator from "./validators/UserValidator";
import authorize from "./middlewares/authorize";

//20 MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;

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

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    files: 10,
    fileSize: MAX_FILE_SIZE,
  },
});

const getUsernameFromRequest = (req: Request): string => {
  const username = req.user?.username;

  if(!username) {
    throw new Error(`
      The username inside the "req.user" object is null or undefined.
      Check if you have used the "authorize" middleware.
    `);
  }

  return username;
};

router.post(
  "/user/updateAvatar",
  authorize(),
  upload.single("avatar"),
  ...UserValidator.updateAvatar,
  asyncHandler(
    async (req, res) => {
      // the validator assures you that req.file exists
      const avatar = req.file as Express.Multer.File;
      const username = getUsernameFromRequest(req);

      await UserRepository.updateAvatar(username, avatar);

      res.json({
        data: { message: "Avatar updated successfully" },
      });
    }
  )
);

router.get("/user/profile", authorize(), asyncHandler(async (req, res) => {
  const username = getUsernameFromRequest(req);

  const data = await UserRepository.getUserProfile(username);

  res.json({ data });
}));

export default router;
