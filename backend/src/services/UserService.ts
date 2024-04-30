import UserModel, { User } from "../models/User";

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

interface FindOneByIdOptions {
  disableGetters?: boolean;
}

const findOneById = async (id: string, options?: FindOneByIdOptions): Promise<User | null> => {
  const user = await UserModel.findOne({ _id: id });

  if(options?.disableGetters) {
    return user?.toObject({ getters: false }) as User | null;
  }

  return user;
};

const updateStatusById = async (userId: string, isOnline: boolean): Promise<boolean> => {
  const res = await UserModel.updateOne(
    { _id: userId },
    { $set: { isOnline } }
  );

  return res.modifiedCount > 0;
};

export default {
  createOne,
  findOneByUsername,
  updateUserAvatar,
  findOneById,
  updateStatusById,
};
