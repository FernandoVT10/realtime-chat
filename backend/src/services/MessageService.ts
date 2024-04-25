import MessageModel from "../models/Message";

import { Message } from "shared/types";

const MAX_NUM_MESSAGES = 20;

const createOne = async (content: string, createdBy: string, sentTo: string): Promise<Message> => {
  const createdMessage = await MessageModel.create({ content, createdBy, sentTo });
  return createdMessage.toObject();
};

const getAll = async (userId: string, friendId: string): Promise<Message[]> => {
  const messages = await MessageModel
    .find({ createdBy: [userId, friendId], sentTo: [userId, friendId] })
    .select("-__v")
    .sort({ createdAt: "desc" })
    .limit(MAX_NUM_MESSAGES)
    .lean();

  return messages as unknown as Message[];
};

export default {
  createOne,
  getAll,
};
