import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import path from "path";

import { RequestError } from "../errors";
import UserService, { CreateUserData } from "../services/UserService";
import { JWT_SECRET_KEY, UPLOADS_DIRECTORY } from "../constants";

import type { UserProfile } from "shared/types";

// 30 days
const JWT_EXPIRE_DATE = "30d";
const SALT_ROUNDS = 10;
const AVATAR_SIZE = 400;
const AVATARS_DIRECTORY = path.join(UPLOADS_DIRECTORY, "avatars/");

const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const passwordsMatch = (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

const getJwtToken = (userId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId },
      JWT_SECRET_KEY,
      { expiresIn: JWT_EXPIRE_DATE },
      (err, token) => {
        if(err || !token) return reject(err);
        resolve(token);
      }
    );
  });
};

const createUser = async (data: CreateUserData): Promise<void> => {
  const hashedPassword = await hashPassword(data.password);

  await UserService.createOne({
    username: data.username,
    password: hashedPassword,
  });
};

const usernameExists = async (username: string): Promise<boolean> => {
  if(await UserService.findOneByUsername(username)) {
    return true;
  }

  return false;
};

interface GetAuthTokenData {
  username: string;
  password: string;
}

const getAuthToken = async (data: GetAuthTokenData): Promise<string> => {
  const user = await UserService.findOneByUsername(data.username, true);

  if(!user) throw new RequestError(400, "Username doesn't exist");

  const match = await passwordsMatch(data.password, user.password);

  if(!match) {
    throw new RequestError(400, "Username or password doesn't match");
  }

  const token = getJwtToken(user._id.toString());

  return token;
};

const updateAvatar = async (userId: string, newAvatar: Express.Multer.File): Promise<void> => {
  const user = await UserService.findOneById(userId, {
    disableGetters: true,
  });

  if(!user) {
    throw new RequestError(500);
  }

  const avatarName = user.avatar || `${user._id.toString()}.webp`;
  const avatarPath = path.join(AVATARS_DIRECTORY, avatarName);

  try {
    await sharp(newAvatar.buffer)
      .resize(AVATAR_SIZE, AVATAR_SIZE)
      .toFile(avatarPath);
  } catch (error) {
    throw new RequestError(400, "The avatar is not a valid image");
  }

  // this code must be below because the image can be invalid
  if(!user.avatar) {
    await UserService.updateUserAvatar(user._id.toString(), avatarName);
  }
};

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const user = await UserService.findOneById(userId);

  if(!user) {
    throw new RequestError(400, "The username doesn't exist");
  }

  return {
    _id: user._id.toString(),
    avatar: user.avatar as string,
    username: user.username,
  };
};

const updateUserStatus = async (userId: string, isOnline: boolean): Promise<boolean> =>
  UserService.updateStatusById(userId, isOnline);

export default {
  createUser,
  usernameExists,
  getAuthToken,
  updateAvatar,
  getUserProfile,
  updateUserStatus,
};
