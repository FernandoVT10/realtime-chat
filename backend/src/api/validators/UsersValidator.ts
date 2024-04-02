import { Schema, checkSchema } from "express-validator";

import checkValidation from "../middlewares/checkValidation";

const usersSchema: Schema = {
  search: {
    in: ["query"],
    isString: {
      errorMessage: "Search must be a string",
    },
    exists: {
      options: { values: "falsy" },
      errorMessage: "Search is required",
    },
  },
};

export default {
  users: [checkSchema(usersSchema), checkValidation],
};
