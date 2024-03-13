import UserModel, { User } from "../../models/User";

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

export default {
  createOne,
  findOneByUsername,
};
