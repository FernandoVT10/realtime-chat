import { UserFriendRequest } from "@types";
import { RequestError } from "../../errors";
import FriendService from "../services/FriendService";

const sendFriendRequest = async (userId: string, friendId: string): Promise<boolean> => {
  let exists = await FriendService.existsRequest(userId, friendId);

  if(exists) throw new RequestError(400, "You have sent a friend request to this user already");

  // if a user tries to send a friend request to another user that have already sent one
  exists = await FriendService.existsRequest(friendId, userId);

  if(exists) throw new RequestError(400, "You have already a friend request from this user");

  await FriendService.createRequest(userId, friendId);

  return true;
};

const getRequestsFromUserId = (userId: string): Promise<UserFriendRequest[]> => {
  return FriendService.findUserFriendsRequests(userId);
};

export default {
  sendFriendRequest,
  getRequestsFromUserId,
};
