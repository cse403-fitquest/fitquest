import { FIREBASE_AUTH } from '@/firebaseConfig';
import {
  DeleteAccountResponse,
  SignInResponse,
  SignOutResponse,
  SignUpResponse,
} from '@/types/auth';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

export enum FirebaseAuthErrorCodes {
  INVALID_LOGIN_CREDENTIALS = 'auth/invalid-login-credentials',
  EMAIL_EXISTS = 'auth/email-already-in-use',
  USER_DISABLED = 'auth/user-disabled',
  USER_NOT_FOUND = 'auth/user-not-found',
  WEAK_PASSWORD = 'auth/weak-password',
  WRONG_PASSWORD = 'auth/wrong-password',
  REQUIRES_RECENT_LOGIN = 'auth/requires-recent-login',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
  OPERATION_NOT_ALLOWED = 'auth/operation-not-allowed',
}

/**
 * Sign in with email and password
 * @param email user's email
 * @param password user's password
 * @returns SignInResponse - an object containing the user's information
 */
export const signIn: (
  email: string,
  password: string,
) => Promise<SignInResponse> = async (email, password) => {
  try {
    // Sign in logic
    const userCredential = await signInWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password,
    );

    return {
      userCredential: userCredential,
      error: null,
    };
  } catch (error: unknown) {
    // Error caused by firebase auth will be an instance of FirebaseError
    if (error instanceof FirebaseError) {
      console.error('Error signing in with Firebase: ', error);

      switch (error.code) {
        case FirebaseAuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
          return {
            userCredential: null,
            error: {
              general: 'Invalid email or password.',
              email: '',
              password: '',
            },
          };
        default:
          return {
            userCredential: null,
            error: {
              general: 'Error signing up. Please try again.',
              email: '',
              password: '',
            },
          };
      }
    } else {
      console.log('Error signing in: ', error);
      return {
        userCredential: null,
        error: {
          general: 'Error signing in. Please try again.',
          email: '',
          password: '',
        },
      };
    }
  }
};

/**
 * Sign up with email and password
 * @param email user's email
 * @param password user's password
 * @returns an object containing the user's information
 */
export const signUp: (
  email: string,
  password: string,
) => Promise<SignUpResponse> = async (email: string, password: string) => {
  try {
    // Sign up logic
    const userCredential = await createUserWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password,
    );

    // Return userCredential
    return {
      userCredential: userCredential,
      error: null,
    };
  } catch (error) {
    // Error caused by firebase auth will be an instance of FirebaseError
    if (error instanceof FirebaseError) {
      console.error('Error signing in with Firebase: ', error);

      switch (error.code) {
        case FirebaseAuthErrorCodes.EMAIL_EXISTS:
          return {
            userCredential: null,
            error: {
              general: 'Email already exists.',
              username: '',
              email: '',
              password: '',
              rePassword: '',
            },
          };
        default:
          return {
            userCredential: null,
            error: {
              general: 'Error signing up. Please try again.',
              username: '',
              email: '',
              password: '',
              rePassword: '',
            },
          };
      }
    } else {
      console.log('Error signing in: ', error);
      return {
        userCredential: null,
        error: {
          general: 'Error signing up. Please try again.',
          username: '',
          email: '',
          password: '',
          rePassword: '',
        },
      };
    }
  }
};

/**
 * Check if a user is logged in
 * @returns a boolean indicating if the user is logged in
 */
export const isLoggedIn = () => {
  return FIREBASE_AUTH.currentUser !== null;
};

/**
 * Sign out the current user
 * @returns a promise that resolves when the user is signed out
 */
export const signOut: () => Promise<SignOutResponse> = async () => {
  try {
    await FIREBASE_AUTH.signOut();
    return {
      error: null,
    };
  } catch (error: unknown) {
    console.log(error);
    return {
      error: 'Error signing out. Please try again.',
    };
  }
};

export const deleteAccount: () => Promise<DeleteAccountResponse> = async () => {
  const user = FIREBASE_AUTH.currentUser;

  if (user) {
    try {
      await user.delete();
      return {
        error: null,
      };
    } catch (error: unknown) {
      console.log(error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/requires-recent-login':
            return {
              error: 'Please reauthenticate before deleting your account.',
            };
          default:
            return {
              error: 'Error deleting account. Please try again.',
            };
        }
      }

      return {
        error: 'Error deleting account. Please try again.',
      };
    }
  }

  return {
    error: 'Error deleting account. Account not found.',
  };
};
