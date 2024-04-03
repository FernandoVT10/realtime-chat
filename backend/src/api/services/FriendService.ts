import FriendRequestModel, { FriendRequest } from "../../models/FriendRequest";

const findRequest = (requestedByUser: string, sentToUser: string): Promise<FriendRequest | null> => {
  return FriendRequestModel.findOne({ requestedByUser, sentToUser });
};

const existsRequest = async (requestedByUser: string, sentToUser: string): Promise<boolean> => {
  const exists = await FriendRequestModel.exists({ requestedByUser, sentToUser });

  return exists ? true : false;
};

const createRequest = async (requestedByUser: string, sentToUser: string): Promise<boolean> => {
  await FriendRequestModel.create({ requestedByUser, sentToUser });

  return true;
};

export default {
  findRequest,
  existsRequest,
  createRequest,
};
