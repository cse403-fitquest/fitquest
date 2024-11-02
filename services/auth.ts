import { BASE_USER } from '@/constants/user';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import {
  DeleteAccountResponse,
  SignInResponse,
  SignOutResponse,
  SignUpResponse,
  User,
} from '@/types/auth';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  QueryDocumentSnapshot,
  setDoc,
} from 'firebase/firestore';

export enum FirebaseAuthErrorCodes {
  INVALID_CREDENTIAL = 'auth/invalid-credential',
  EMAIL_EXISTS = 'auth/email-already-in-use',
  USER_DISABLED = 'auth/user-disabled',
  USER_NOT_FOUND = 'auth/user-not-found',
  WEAK_PASSWORD = 'auth/weak-password',
  WRONG_PASSWORD = 'auth/wrong-password',
  REQUIRES_RECENT_LOGIN = 'auth/requires-recent-login',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
  OPERATION_NOT_ALLOWED = 'auth/operation-not-allowed',
}

const userConverter = {
  toFirestore: (data: User) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as User,
};

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

    if (!userCredential.user) {
      throw new Error('User not found.');
    }

    // Get user document from Firestore
    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    const userDoc = doc(userCollection, userCredential.user.uid);

    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      throw new Error('User not found.');
    }

    return {
      data: {
        user: userSnap.data(),
      },
      success: true,
      error: null,
    };
  } catch (error: unknown) {
    // Error caused by firebase auth will be an instance of FirebaseError
    if (error instanceof FirebaseError) {
      console.error('Error signing in with Firebase: ', error);

      switch (error.code) {
        case FirebaseAuthErrorCodes.INVALID_CREDENTIAL:
          return {
            success: false,
            data: null,
            error: 'Invalid email or password.',
          };
        default:
          return {
            success: false,
            data: null,
            error: 'Error signing in. Please try again.',
          };
      }
    } else {
      console.log('Error signing in: ', error);
      return {
        success: false,
        data: null,
        error: 'Error signing in. Please try again.',
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
  username: string,
  email: string,
  password: string,
) => Promise<SignUpResponse> = async (
  username,
  email: string,
  password: string,
) => {
  try {
    // Sign up logic
    const userCredential = await createUserWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password,
    );

    // Create user document in Firestore with the user's ID
    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    const newUser = {
      ...BASE_USER,
      id: userCredential.user.uid,
      profileInfo: {
        ...BASE_USER.profileInfo,
        username,
        email,
      },
      createdAt: new Date(),
    };

    await setDoc(doc(userCollection, userCredential.user.uid), newUser);

    // Return userCredential
    return {
      data: {
        user: newUser,
      },
      success: true,
      error: null,
    };
  } catch (error) {
    // Error caused by firebase auth will be an instance of FirebaseError
    if (error instanceof FirebaseError) {
      console.error('Error signing in with Firebase: ', error);

      switch (error.code) {
        case FirebaseAuthErrorCodes.EMAIL_EXISTS:
          return {
            data: null,
            success: false,
            error: 'Email already exists.',
          };
        default:
          return {
            data: null,
            success: false,
            error: 'Error signing up. Please try again.',
          };
      }
    } else {
      console.log('Error signing in: ', error);
      return {
        data: null,
        success: false,
        error: 'Error signing up. Please try again.',
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
      success: true,
      data: null,
      error: null,
    };
  } catch (error: unknown) {
    console.log(error);
    return {
      success: false,
      data: null,
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
        success: true,
        data: null,
        error: null,
      };
    } catch (error: unknown) {
      console.log(error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/requires-recent-login':
            return {
              success: false,
              data: null,
              error: 'Please reauthenticate before deleting your account.',
            };
          default:
            return {
              success: false,
              data: null,
              error: 'Error deleting account. Please try again.',
            };
        }
      }

      return {
        success: false,
        data: null,
        error: 'Error deleting account. Please try again.',
      };
    }
  }

  return {
    success: false,
    data: null,
    error: 'Error deleting account. Account not found.',
  };
};
