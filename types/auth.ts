import { UserCredential } from 'firebase/auth';

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

export type SignInResponse = {
  user: UserCredential | null;
  error: SignInErrorState | null;
};

export type SignUpResponse = {
  user: UserCredential | null;
  error: SignUpErrorState | null;
};
