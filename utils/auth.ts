import { FIREBASE_AUTH } from '@/firebaseConfig';
import {
  DeleteAccountResponse,
  SignInResponse,
  SignOutResponse,
  SignUpResponse,
} from '@/types/auth';
import { FirebaseError } from 'firebase/app';
import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/**
 * Sign in with email and password
 * @param email user's email
 * @param password user's password
 * @returns SignInResponse - an object containing the user's information
 */
export const signIn: (
  email: string,
  password: string,
) => Promise<SignInResponse> = async (email: string, password: string) => {
  try {
    // Sign in logic
    const userCredential = await signInWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password,
    );

    return {
      user: userCredential,
      error: null,
    };
  } catch (error: unknown) {
    // Error caused by firebase auth will be an instance of FirebaseError
    if (error instanceof FirebaseError) {
      console.error('Error signing in with Firebase: ', error);

      switch (error.code) {
        case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
          return {
            user: null,
            error: {
              general: 'Invalid email or password.',
              email: '',
              password: '',
            },
          };
        default:
          return {
            user: null,
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
        user: null,
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
      user: userCredential,
      error: null,
    };
  } catch (error) {
    // Error caused by firebase auth will be an instance of FirebaseError
    if (error instanceof FirebaseError) {
      console.error('Error signing in with Firebase: ', error);

      switch (error.code) {
        case AuthErrorCodes.EMAIL_EXISTS:
          return {
            user: null,
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
            user: null,
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
        user: null,
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
