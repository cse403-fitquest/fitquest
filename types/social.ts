import { APIResponse } from './general';
import { User } from './user';

export type Friend = Pick<User, 'id' | 'privacySettings'> & {
  profileInfo: {
    username: string;
    email: string;
  };
  currentQuest: string | null;
};

export type UserFriend = {
  id: string;
  friends: Friend[];
  sentRequests: string[];
  pendingRequests: Friend[];
};

export type GetUserFriendsResponse = APIResponse & {
  data: UserFriend | null;
};

export type GetUserByEmailResponse = APIResponse & {
  data: User | null;
};
