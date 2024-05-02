export interface UserProfile {
  _id: string;
  username: string;
  avatar: string;
}

export interface FriendProfile extends UserProfile {
  pendingMessagesCount: number;
  isOnline: boolean;
}

export interface UserFriendRequest {
  _id: string;
  user: UserProfile;
}

export interface Message {
  _id: string;
  content: string;
  createdBy: string;
  sentTo: string;
  hasBeenRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessagesPagination {
  messages: Message[];
  messagesCount: number;
  limit: number;
}
