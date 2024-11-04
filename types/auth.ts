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
  userCredential: UserCredential | null;
  error: SignInErrorState | null;
};

export type SignUpResponse = {
  userCredential: UserCredential | null;
  error: SignUpErrorState | null;
};

export type SignOutResponse = {
  error: string | null;
};

export type DeleteAccountResponse = {
  error: string | null;
};
