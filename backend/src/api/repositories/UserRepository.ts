import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { RequestError } from "../../errors";
import UserService, { CreateUserData } from "../services/UserService";
import { JWT_SECRET_KEY } from "../../constants";

// 30 days
const JWT_EXPIRE_DATE = "30d";
const SALT_ROUNDS = 10;

const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const passwordsMatch = (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

const getJwtToken = (username: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username },
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
  const user = await UserService.findOneByUsername(data.username);

  if(!user) throw new RequestError(400, "Username doesn't exist");

  const match = await passwordsMatch(data.password, user.password);

  if(!match) {
    throw new RequestError(400, "Username or password doesn't match");
  }

  const token = getJwtToken(user.username);

  return token;
};

export default {
  createUser,
  usernameExists,
  getAuthToken,
};
