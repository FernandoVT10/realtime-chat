import UserModel, { User } from "../../models/User";

export interface CreateUserData {
  username: string;
  password: string;
}

const createOne = (data: CreateUserData): Promise<User> => {
  return UserModel.create(data);
};

const findOneByUsername = (username: string, includePassword = false): Promise<User | null> => {
  if(includePassword) {
    return UserModel.findOne({ username }).select("+password").exec();
  }
  return UserModel.findOne({ username });
};

const updateUserAvatar = async (userId: string, avatar: string): Promise<boolean> => {
  const result = await UserModel.updateOne({ _id: userId }, { avatar });

  return result.modifiedCount > 0;
};

const findOneById = (id: string): Promise<User | null> => {
  return UserModel.findOne({ _id: id });
};

export default {
  createOne,
  findOneByUsername,
  updateUserAvatar,
  findOneById,
};
