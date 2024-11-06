import { BASE_USER } from '@/constants/user';
import { FIREBASE_DB } from '@/firebaseConfig';
import { User } from '@/types/user';
import { CreateUserResponse, GetUserResponse } from '@/types/user';
import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  QueryDocumentSnapshot,
  setDoc,
} from 'firebase/firestore';

const userConverter = {
  toFirestore: (data: User) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as User,
};

/**
 * Create a new user document in Firestore
 * @param id user's ID
 * @param username user's username
 * @param email user's email
 * @returns CreateUserResponse - an object containing the user's information
 */
export const createUser: (
  id: string,
  username: string,
  email: string,
) => Promise<CreateUserResponse> = async (id, username, email) => {
  try {
    // Create user document in Firestore with the user's ID
    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    const newUser: User = {
      ...BASE_USER,
      id: id,
      profileInfo: {
        ...BASE_USER.profileInfo,
        username,
        email,
      },
      createdAt: new Date(),
    };

    await setDoc(doc(userCollection, id), newUser);

    return {
      success: true,
      data: { user: newUser },
      error: null,
    };
  } catch (error: unknown) {
    // Error caused by firestore will be an instance of FirebaseError
    if (error instanceof FirebaseError) {
      console.error('Error creating user with Firestore: ', error);

      return {
        success: false,
        data: null,
        error: 'Error creating user with Firestore. Please try again.',
      };
    } else {
      console.log('Error creating user: ', error);
      return {
        success: false,
        data: null,
        error: 'Error creating user. Please try again.',
      };
    }
  }
};

/**
 * Get user document from Firestore
 * @param userID user's ID
 * @returns GetUserResponse - an object containing the user's information or an error message
 */
export const getUser: (userID: string) => Promise<GetUserResponse> = async (
  userID,
) => {
  try {
    // Get user document from Firestore
    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    const userDoc = doc(userCollection, userID);

    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      throw new Error('User not found.');
    }

    return {
      success: true,
      data: {
        user: userSnap.data(),
      },
      error: null,
    };
  } catch (error: unknown) {
    // Error caused by firestore will be an instance of FirebaseError
    if (error instanceof FirebaseError) {
      console.error(
        'Error getting user with Firestore: ',
        error.code,
        error.message,
      );

      return {
        success: false,
        data: null,
        error: 'Error getting user with Firestore. Please try again.',
      };
    } else {
      console.log('Error getting user: ', error);
      return {
        success: false,
        data: null,
        error: 'Error getting user. Please try again.',
      };
    }
  }
};
