import { User } from './auth';

export type UserFriend = {
  id: string;
  friends: User[];
  sentRequests: string[];
  pendingRequests: User[];
};
