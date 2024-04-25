import Joi, { CustomValidator } from "joi";

import { isValidObjectId } from "mongoose";
import { MESSAGE_CONFIG } from "shared/constants";

const validateId: CustomValidator = (value, helpers) => {
  if(!isValidObjectId(value)) return helpers.error("any.invalid");
  return value;
};

const friendIdValidator = Joi.string()
  .custom(validateId)
  .messages({
    "string.empty": "FriendId is required",
    "string.base": "FriendId must be a string",
    "any.invalid": "The id \"{friendId}\" is not valid",
  });

export const sendMessageSchema = Joi.object({
  message: Joi.string()
    .max(MESSAGE_CONFIG.contentMaxLength)
    .required()
    .messages({
      "string.empty": "Message is required",
      "string.max": `Message can't be larger than ${MESSAGE_CONFIG.contentMaxLength} characters long`,
      "string.base": "Message must be a string",
    }),
  friendId: friendIdValidator,
});

export const getMessagesSchema = Joi.object({
  friendId: friendIdValidator,
});
