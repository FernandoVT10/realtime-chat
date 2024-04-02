import UserModel from "../../models/User";
import type { UserProfile } from "@types";

const USERS_LIMIT = 10;

const getUsersByUsernameSearch = (search: string): Promise<UserProfile[]> => {
  const regex = new RegExp(search, "i");

  return UserModel.find<UserProfile>({
    username: { $regex: regex },
  }).select(["username", "avatar", "_id"]).limit(USERS_LIMIT);
};

export default {
  getUsersByUsernameSearch,
};
