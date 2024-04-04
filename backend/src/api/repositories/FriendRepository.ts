import { UserFriendRequest } from "@types";
import { RequestError } from "../../errors";
import FriendService from "../services/FriendService";

const sendFriendRequest = async (userId: string, friendId: string): Promise<boolean> => {
  if(userId === friendId)
    throw new RequestError(404, "You can't send a friend request to yourself");

  let exists = await FriendService.existsRequest(userId, friendId);
  if(exists) throw new RequestError(400, "You have sent a friend request to this user already");

  exists = await FriendService.existsRequest(friendId, userId);
  if(exists) throw new RequestError(400, "You have already a friend request from this user");

  exists = await FriendService.existsFriendship(userId, friendId);
  if(exists) throw new RequestError(400, "This user is already your friend");

  await FriendService.createRequest(userId, friendId);

  return true;
};

const getFriendsRequests = (userId: string): Promise<UserFriendRequest[]> => 
  FriendService.findFriendsRequests(userId);

const acceptFriendRequest = async (userId: string, friendRequestId: string): Promise<boolean> => {
  const request = await FriendService.findRequestById(friendRequestId);

  // the request must have been sent to the user that is accepting the request
  if(request?.sentToUser.toString() !== userId) {
    throw new RequestError(404, "You can't accept a friend request that was not sent to you");
  }

  await FriendService.createFriendship(
    userId, request.requestedByUser.toString()
  );

  return await FriendService.deleteRequestById(request.id);
};

export default {
  sendFriendRequest,
  getFriendsRequests,
  acceptFriendRequest,
};
