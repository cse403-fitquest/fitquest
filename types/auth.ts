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

export type SignInResponse = APIResponse & {};

export type SignUpResponse = APIResponse & {};

export type SignOutResponse = APIResponse & {};

export type DeleteAccountResponse = {
  error: string | null;
};
