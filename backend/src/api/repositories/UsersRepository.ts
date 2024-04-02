import UsersService from "../services/UsersService";

import type { UserProfile } from "@types";

const searchUsers = async (search: string): Promise<UserProfile[]> => {
  const users = await UsersService.getUsersByUsernameSearch(search);

  return users;
};

export default {
  searchUsers,
};