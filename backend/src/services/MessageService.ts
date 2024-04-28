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

  return messages.reverse() as unknown as Message[];
};

const markMessagesAsRead = async (userId: string, friendId: string): Promise<void> => {
  await MessageModel.updateMany(
    {
      createdBy: [userId, friendId],
      sentTo: [userId, friendId],
      hasBeenRead: false,
    },
    { $set: { hasBeenRead: true } }
  );
};

const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  const res = await MessageModel.updateOne(
    { _id: messageId, hasBeenRead: false },
    { $set: { hasBeenRead: true } }
  );
  return res.modifiedCount > 0;
};

export default {
  createOne,
  getAll,
  markMessagesAsRead,
  markMessageAsRead,
};
