import { isValidObjectId } from "mongoose";
import { Schema, checkSchema } from "express-validator";
import checkValidation from "../middlewares/checkValidation";

import UserService from "../../services/UserService";
import FriendsService from "../../services/FriendsService";

const sendFriendRequestSchema: Schema = {
  friendId: {
    in: "body",
    custom: {
      options: async (friendId) => {
        if(!isValidObjectId(friendId)) {
          throw new Error("Invalid id");
        }

        const user = await UserService.findOneById(friendId);

        if(!user) throw new Error("No user found with this id");

        return true;
      },
    },
  },
};

const acceptFriendRequestSchema: Schema = {
  friendRequestId: {
    in: "body",
    custom: {
      options: async (friendRequestId) => {
        if(!isValidObjectId(friendRequestId)) {
          throw new Error("Invalid id");
        }

        const request = await FriendsService.findRequestById(friendRequestId);

        if(!request) throw new Error("No friend request found with this id");

        return true;
      },
    },
  },
};

export default {
  sendFriendRequest: [checkSchema(sendFriendRequestSchema), checkValidation],
  acceptFriendRequest: [checkSchema(acceptFriendRequestSchema), checkValidation],
};
