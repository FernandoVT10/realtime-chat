import MessageModel from "../models/Message";

import { Message } from "shared/types";

const createOne = async (content: string, createdBy: string, sentTo: string): Promise<Message> => {
  const createdMessage = await MessageModel.create({ content, createdBy, sentTo });
  return createdMessage.toObject();
};

const getAll = async (userId: string, friendId: string, limit: number, offset: number): Promise<Message[]> => {
  const messages = await MessageModel
    .find({ createdBy: [userId, friendId], sentTo: [userId, friendId] })
    .select("-__v")
    .sort({ createdAt: "desc" })
    .limit(limit)
    .skip(offset)
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

const countAll = (userId: string, friendId: string): Promise<number> => {
  return MessageModel.countDocuments({
    createdBy: [userId, friendId],
    sentTo: [userId, friendId],
  });
};

export default {
  createOne,
  getAll,
  markMessagesAsRead,
  markMessageAsRead,
  countAll,
};
