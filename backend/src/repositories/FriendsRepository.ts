import type { UserFriendRequest, FriendProfile } from "shared/types";
import { RequestError } from "../errors";
import FriendsService from "../services/FriendsService";

const sendRequest = async (userId: string, friendId: string): Promise<boolean> => {
  if(userId === friendId)
    throw new RequestError(400, "You can't send a friend request to yourself");

  let exists = await FriendsService.existsRequest(userId, friendId);
  if(exists) throw new RequestError(400, "You have sent a friend request to this user already");

  exists = await FriendsService.existsRequest(friendId, userId);
  if(exists) throw new RequestError(400, "You have already a friend request from this user");

  exists = await FriendsService.existsFriendship(userId, friendId);
  if(exists) throw new RequestError(400, "This user is already your friend");

  await FriendsService.createRequest(userId, friendId);

  return true;
};

const getFriendsRequests = (userId: string): Promise<UserFriendRequest[]> => 
  FriendsService.findFriendsRequests(userId);

const acceptRequest = async (userId: string, friendRequestId: string): Promise<boolean> => {
  const request = await FriendsService.findRequestById(friendRequestId);

  // the request must have been sent to the user that is accepting the request
  if(request?.sentToUser.toString() !== userId) {
    throw new RequestError(404, "You can't accept a friend request that was not sent to you");
  }

  await FriendsService.createFriendship(
    userId, request.requestedByUser.toString()
  );

  return await FriendsService.deleteRequestById(request.id);
};

const getFriends = async (userId: string): Promise<FriendProfile[]> => {
  const users = await FriendsService.findFriends(userId);

  const friends: FriendProfile[] = [];

  for(const user of users) {
    const count = await FriendsService.countPendingMessages(userId, user._id);

    friends.push({ ...user, pendingMessagesCount: count });
  }

  return friends;
};

const getFriendsIds = async(userId: string): Promise<string[]> =>
  FriendsService.getFriendsIds(userId);

export default {
  sendRequest,
  getFriendsRequests,
  acceptRequest,
  getFriends,
  getFriendsIds,
};
