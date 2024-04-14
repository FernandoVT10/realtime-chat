import UserModel from "../../models/User";
import type { UserProfile } from "shared/types";

const USERS_LIMIT = 10;

const getUsersByUsernameSearch = (search: string, excludeUser: string): Promise<UserProfile[]> => {
  const regex = new RegExp(search, "i");

  return UserModel.find<UserProfile>({
    _id: { $not: { $eq: excludeUser } },
    username: { $regex: regex },
  }).select(["username", "avatar", "_id"]).limit(USERS_LIMIT);
};

export default {
  getUsersByUsernameSearch,
};
