import { Message } from "shared/types";
import { RequestError } from "../errors";
import { ValidationError } from "joi";
import { sendMessageSchema } from "../validationSchemas";

import MessageService from "../services/MessageService";
import FriendsService from "../api/services/FriendsService";

const getFirstErrorMessage = (error: unknown) => {
  if(error instanceof ValidationError) {
    return error.details[0].message;
  }

  return "Internal server error";
};

const createMessage = async (userId: string, friendId: string, message: string): Promise<Message> => {
  try {
    await sendMessageSchema.validateAsync({ message, friendId }, { abortEarly: true });
  } catch (error) {
    throw new RequestError(400, getFirstErrorMessage(error));
  }

  if(userId == friendId) {
    throw new RequestError(400, "You can't send a message to yourself");
  }

  const isMyFriend = await FriendsService.existsFriendship(userId, friendId);

  if(!isMyFriend) {
    throw new RequestError(400, `The user with the id "${friendId}" must be your friend`);
  }

  const createdMessage = await MessageService.createOne(message, userId, friendId);
  return createdMessage;
};

export default {
  createMessage,
};
