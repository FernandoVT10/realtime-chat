export interface UserProfile {
  _id: string;
  username: string;
  avatar: string;
}

export interface UserFriendRequest {
  _id: string;
  user: UserProfile;
}
