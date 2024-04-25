import MessageModel from "../models/Message";

import { Message } from "shared/types";

const createOne = async (content: string, createdBy: string, sentTo: string): Promise<Message> => {
  const createdMessage = await MessageModel.create({ content, createdBy, sentTo });
  return createdMessage.toObject();
};

export default {
  createOne,
};
