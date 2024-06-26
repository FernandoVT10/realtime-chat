import { HydratedDocument } from "mongoose";
import { User } from "../models/User";
import FriendRequestModel, { FriendRequest } from "../models/FriendRequest";
import FriendModel from "../models/Friend";
import MessageModel from "../models/Message";

import type { UserFriendRequest, UserProfile, FriendProfile } from "shared/types";

const existsRequest = async (requestedByUser: string, sentToUser: string): Promise<boolean> => {
  const exists = await FriendRequestModel.exists({ requestedByUser, sentToUser });

  return exists ? true : false;
};

const createRequest = async (requestedByUser: string, sentToUser: string): Promise<boolean> => {
  await FriendRequestModel.create({ requestedByUser, sentToUser });

  return true;
};

const findFriendsRequests = async (userId: string): Promise<UserFriendRequest[]> => {
  const requests = await FriendRequestModel.find({ sentToUser: userId }).populate({
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

const existsFriendship = async (userId: string, friendId: string): Promise<boolean> => {
  const exists = await FriendModel.exists({ user: userId, friend: friendId });
  return exists ? true : false;
};

const createFriendship = async (userId: string, friendId: string): Promise<boolean> => {
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

type PartialFriendProfile = Exclude<FriendProfile, "countPendingMessages">;

const findFriends = async (userId: string): Promise<PartialFriendProfile[]> => {
  const friendsDocs = await FriendModel
    .find({ user: userId })
    .select("friend")
    .populate({
      path: "friend",
      select: ["_id", "avatar", "username", "isOnline"],
    });

  return friendsDocs.map(friendDoc => {
    return (friendDoc.friend as HydratedDocument<User>)
      .toObject({ getters: true }) as PartialFriendProfile;
  });
};

const countPendingMessages = (userId: string, friendId: string): Promise<number> => {
  return MessageModel.countDocuments({
    createdBy: friendId,
    sentTo: userId,
    hasBeenRead: false,
  });
};

const getFriendsIds = async (userId: string): Promise<string[]> => {
  const friendsDocs = await FriendModel
    .find({ user: userId })
    .select("friend")
    .lean();

  return friendsDocs.map(friendDoc => {
    return friendDoc.friend.toString();
  });
};

export default {
  existsRequest,
  createRequest,
  findFriendsRequests,
  findRequestById,
  deleteRequestById,
  existsFriendship,
  createFriendship,
  findFriends,
  countPendingMessages,
  getFriendsIds,
};
