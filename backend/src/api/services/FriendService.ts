import FriendRequestModel, { FriendRequest } from "../../models/FriendRequest";
import FriendModel from "../../models/Friend";

import { UserFriendRequest, UserProfile } from "@types";

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

const findUserFriendsRequests = async (userId: string): Promise<UserFriendRequest[]> => {
  const requests =  await FriendRequestModel.find({ sentToUser: userId }).populate({
    path: "requestedByUser",
    select: ["_id", "username", "avatar"],
  }).select(["_id", "requestedByUser"]);

  return requests.map(request => {
    return {
      _id: request.id,
      user: request.requestedByUser as unknown as UserProfile,
    };
  });
};

const findRequestById = (requestId: string): Promise<FriendRequest | null> => {
  return FriendRequestModel.findById(requestId);
};

const deleteRequestById = async (requestId: string): Promise<boolean> => {
  await FriendRequestModel.findByIdAndDelete(requestId);

  return true;
};

const createRelationship = async (userId: string, friendId: string): Promise<boolean> => {
  await FriendModel.create(
    {
      user: userId,
      friend: friendId,
    },
    {
      user: friendId,
      friend: userId,
    }
  );

  return true;
};

export default {
  findRequest,
  existsRequest,
  createRequest,
  findUserFriendsRequests,
  findRequestById,
  deleteRequestById,
  createRelationship,
};
