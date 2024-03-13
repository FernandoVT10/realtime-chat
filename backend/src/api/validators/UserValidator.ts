import { Schema, checkSchema } from "express-validator";

import UserRepository from "../repositories/UserRepository";
import checkValidation from "../middlewares/checkValidation";

const USERNAME_MAX_LENGTH = 25;

const createUserSchema: Schema = {
  username: {
    exists: {
      options: { values: "falsy" },
      errorMessage: "Username is required",
      bail: true,
    },
    isLength: {
      options: { max: USERNAME_MAX_LENGTH },
      errorMessage: "Username max length is 25",
      bail: true,
    },
    custom: {
      options: async (username) => {
        if(await UserRepository.usernameExists(username)) {
          throw new Error("Username is already taken");
        }

        return true;
      },
    },
  },
  password: {
    exists: {
      options: { values: "falsy" },
      errorMessage: "Password is required",
    },
  },
};

const loginSchema: Schema = {
  username: {
    exists: {
      options: { values: "falsy" },
      errorMessage: "Username is required",
      bail: true,
    },
    isLength: {
      options: { max: USERNAME_MAX_LENGTH },
      errorMessage: "Username max length is 25",
      bail: true,
    },
  },
  password: {
    exists: {
      options: { values: "falsy" },
      errorMessage: "Password is required",
    },
  },
};


export default {
  createUser: [checkSchema(createUserSchema), checkValidation],
  login: [checkSchema(loginSchema), checkValidation],
};
