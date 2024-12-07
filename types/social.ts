import { AnimatedSpriteID } from '@/constants/sprite';
import { APIResponse } from './general';
import { User } from './user';

export type Friend = Pick<User, 'id' | 'privacySettings'> & {
  profileInfo: {
    username: string;
    email: string;
  };
  lastWorkoutDate: Date | null;
  spriteID: AnimatedSpriteID;
  currentQuest: string | null;
};

export type FriendRequest = {
  id: string;
  username: string;
  email: string;
};

export type UserFriendInDB = {
  id: string;
  friends: string[];
  sentRequests: string[];
  pendingRequests: string[];
};

export type UserFriend = {
  id: string;
  friends: Friend[];
  sentRequests: FriendRequest[];
  pendingRequests: FriendRequest[];
};

export type GetUserFriendsResponse = APIResponse & {
  data: UserFriend | null;
};

export type GetUserByEmailResponse = APIResponse & {
  data: User | null;
};

export type GetUserByUsernameResponse = APIResponse & {
  data: User | null;
};

export type SendFriendRequestResponse = APIResponse & {
  data: FriendRequest | null;
};

export type AcceptFriendRequestResponse = APIResponse & {
  data: Friend | null;
};
