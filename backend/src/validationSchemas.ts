import Joi from "joi";

import { isValidObjectId } from "mongoose";
import { MESSAGE_CONFIG } from "shared/constants";

export const sendMessageSchema = Joi.object({
  message: Joi.string()
    .max(MESSAGE_CONFIG.contentMaxLength)
    .required()
    .messages({
      "string.empty": "Message is required",
      "string.max": `Message can't be larger than ${MESSAGE_CONFIG.contentMaxLength} characters long`,
      "string.base": "Message must be a string",
    }),
  friendId: Joi.string()
    .custom((value, helpers) => {
      if(!isValidObjectId(value)) return helpers.error("any.invalid");
      return value;
    })
    .messages({
      "string.empty": "FriendId is required",
      "string.base": "FriendId must be a string",
      "any.invalid": "The id \"{friendId}\" is not valid",
    }),
});
