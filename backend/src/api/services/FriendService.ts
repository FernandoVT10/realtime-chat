import FriendModel, { Friend } from "../../models/Friend";

const searchRequest = async (userId: string, friendId: string): Promise<Friend | null> => {
  return FriendModel.findOne({ userId, friendId });
};

const createRequest = async (userId: string, friendId: string): Promise<boolean> => {
  await FriendModel.create({ userId, friendId });

  return true;
};

export default {
  searchRequest,
  createRequest,
};
