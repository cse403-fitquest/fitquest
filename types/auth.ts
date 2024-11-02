import { APIResponse } from './general';

export type SignInErrorState = {
  general: string;
  email: string;
  password: string;
};

export type SignUpErrorState = {
  general: string;
  username: string;
  email: string;
  password: string;
  rePassword: string;
};

export type SignInResponse = APIResponse & {
  data: {
    user: User;
  } | null;
};

export type SignUpResponse = APIResponse & {
  data: {
    user: User;
  } | null;
};

export type SignOutResponse = APIResponse & {};

export type DeleteAccountResponse = APIResponse & {};

export type User = {
  id: string;
  profileInfo: {
    email: string;
    username: string;
    age: number;
    height: number;
    weight: number;
  };
  spriteID: string;
  attributes: { power: number; speed: number; health: number };
  exp: number;
  gold: number;
  currentQuest: string;
  privacySettings: {
    isLastWorkoutPublic: boolean;
    isCurrentQuestPublic: boolean;
  };
  attributePoints: number;
  friends: string[];
  sentFriendRequests: string[];
  incomingFriendRequests: string[];
  createdAt: Date;
};
