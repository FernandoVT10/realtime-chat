import UserModel, { User } from "../../models/User";

const USERS_LIMIT = 10;

export interface UserProfile {
  _id: User["_id"];
  username: User["username"];
  avatar: User["avatar"];
}

export interface CreateUserData {
  username: string;
  password: string;
}

const createOne = (data: CreateUserData): Promise<User> => {
  return UserModel.create(data);
};

const findOneByUsername = (username: string): Promise<User | null> => {
  return UserModel.findOne({ username });
};

const updateUserAvatar = async (userId: string, avatar: string): Promise<boolean> => {
  const result = await UserModel.updateOne({ _id: userId }, { avatar });

  return result.modifiedCount > 0;
};

const findOneById = (id: string): Promise<User | null> => {
  return UserModel.findOne({ _id: id });
};

const getUsersByUsernameSearch = (search: string): Promise<UserProfile[]> => {
  const regex = new RegExp(search);

  return UserModel.find<UserProfile>({
    username: { $regex: regex },
  }).select(["username", "avatar", "_id"]).limit(USERS_LIMIT);
};

export default {
  createOne,
  findOneByUsername,
  updateUserAvatar,
  findOneById,
  getUsersByUsernameSearch,
};
