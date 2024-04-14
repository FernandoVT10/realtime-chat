import UsersService from "../services/UsersService";

import type { UserProfile } from "shared/types";

const searchUsers = async (search: string, excludeUser: string): Promise<UserProfile[]> => {
  const users = await UsersService.getUsersByUsernameSearch(search, excludeUser);

  return users;
};

export default {
  searchUsers,
};
