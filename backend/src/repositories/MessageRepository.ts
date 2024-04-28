import { Message } from "shared/types";
import { RequestError } from "../errors";
import { ValidationError } from "joi";
import { sendMessageSchema, getMessagesSchema } from "../validationSchemas";

import MessageService from "../services/MessageService";
import FriendsService from "../services/FriendsService";

const getFirstErrorMessage = (error: unknown) => {
  if(error instanceof ValidationError) {
    return error.details[0].message;
  }

  return "Internal server error";
};

const validateUsersIds = async (userId: string, friendId: string): Promise<boolean> => {
  if(userId == friendId) {
    throw new RequestError(400, `UserId "${userId}" and FriendId: "${friendId} cannot be the same`);
  }

  const isMyFriend = await FriendsService.existsFriendship(userId, friendId);

  if(!isMyFriend) {
    throw new RequestError(400, `The user with the id "${friendId}" must be your friend`);
  }

  return true;
};

const createMessage = async (userId: string, friendId: string, message: string): Promise<Message> => {
  try {
    await sendMessageSchema.validateAsync({ message, friendId }, { abortEarly: true });
  } catch (error) {
    throw new RequestError(400, getFirstErrorMessage(error));
  }

  await validateUsersIds(userId, friendId);

  const createdMessage = await MessageService.createOne(message, userId, friendId);
  return createdMessage;
};

const getMesssages = async (userId: string, friendId: string): Promise<Message[]> => {
  try {
    await getMessagesSchema.validateAsync({ friendId }, { abortEarly: true });
  } catch (error) {
    throw new RequestError(400, getFirstErrorMessage(error));
  }

  await validateUsersIds(userId, friendId);

  const messages = await MessageService.getAll(userId, friendId);

  await MessageService.markMessagesAsRead(userId, friendId);

  return messages;
};

const markMessageAsRead = (messageId: string): Promise<boolean> =>
  MessageService.markMessageAsRead(messageId);

export default {
  createMessage,
  getMesssages,
  markMessageAsRead,
};
