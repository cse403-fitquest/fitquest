import { BASE_USER } from '@/constants/user';
import { FIREBASE_DB } from '@/firebaseConfig';
import { APIResponse } from '@/types/general';
import { User } from '@/types/user';
import { CreateUserResponse, GetUserResponse } from '@/types/user';
import { Workout } from '@/types/workout';
import { fromTimestampToDate } from '@/utils/general';
import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { getUserByUsername } from './user.helper';

export const userConverter = {
  toFirestore: (data: User) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    // Convert workoutHistory startedAt to Date object
    const data = snap.data() as Omit<User, 'createdAt' | 'workoutHistory'> & {
      createdAt: Timestamp;
      workoutHistory: Array<
        Omit<Workout, 'startedAt'> & {
          startedAt: Timestamp;
        }
      >;
    };

    const newWorkoutHistory = data.workoutHistory.map((workout) => {
      return {
        ...workout,
        startedAt: fromTimestampToDate(workout.startedAt),
      };
    });

    return {
      ...data,
      createdAt: fromTimestampToDate(data.createdAt),
      workoutHistory: newWorkoutHistory,
    };
  },
};

/**
 * Fill missing user fields in Firestore based on changes to the User type
 */
export const fillMissingUserFields: () => Promise<APIResponse> = async () => {
  try {
    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    // Update each user document in Firestore
    const usersSnapshot = await getDocs(userCollection);

    const batch = writeBatch(FIREBASE_DB);
    usersSnapshot.docs.forEach(async (userDoc) => {
      const user = userDoc.data();

      // Add missing fields to user document
      const updatedUser = {
        ...BASE_USER,
        ...user,
        profileInfo: {
          ...BASE_USER.profileInfo,
          ...user.profileInfo,
        },
        privacySettings: {
          ...BASE_USER.privacySettings,
          ...user.privacySettings,
        },
        createdAt: user.createdAt || new Date(),
      };

      const userDocRef = doc(userCollection, user.id);

      batch.set(userDocRef, updatedUser);
    });

    await batch.commit();

    console.log('User fields updated successfully.');

    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error(
        'Error filling missing user fields: ',
        error.code,
        error.message,
      );

      return {
        data: null,
        success: false,
        error: 'Error filling missing user fields. Please try again.',
      };
    } else {
      console.error('Error filling missing user fields: ', error);

      return {
        data: null,
        success: false,
        error: 'Error filling missing user fields. Please try again.',
      };
    }
  }
};

/**
 * Fill missing user fields in Firestore based on changes to the User type
 */
export const updateAllUsersInDB: () => Promise<APIResponse> = async () => {
  try {
    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    // Update each user document in Firestore
    const usersSnapshot = await getDocs(userCollection);

    const batch = writeBatch(FIREBASE_DB);
    usersSnapshot.docs.forEach(async (userDoc) => {
      const user = userDoc.data();

      // Add missing fields to user document
      const updatedUser: User = {
        ...BASE_USER,
        ...user,
        profileInfo: {
          ...BASE_USER.profileInfo,
          ...user.profileInfo,
        },
        privacySettings: {
          ...BASE_USER.privacySettings,
          ...user.privacySettings,
        },
        createdAt: user.createdAt || new Date(),
      };

      const userDocRef = doc(userCollection, user.id);

      batch.set(userDocRef, updatedUser);
    });

    await batch.commit();

    console.log('User fields updated successfully.');

    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error(
        'Error filling missing user fields: ',
        error.code,
        error.message,
      );

      return {
        data: null,
        success: false,
        error: 'Error filling missing user fields. Please try again.',
      };
    } else {
      console.error('Error filling missing user fields: ', error);

      return {
        data: null,
        success: false,
        error: 'Error filling missing user fields. Please try again.',
      };
    }
  }
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

/**
 * Update user profile in Firestore
 * @param userId user's ID
 * @param updates object containing the fields to update
 * @returns APIResponse - an object containing the success status, data, and error message
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>,
): Promise<APIResponse> => {
  try {
    // Check if updates changes the username
    if (updates.profileInfo?.username) {
      // Check if the new username is already taken
      const userByUsernameResponse = await getUserByUsername(
        updates.profileInfo.username,
      );

      if (userByUsernameResponse.success) {
        return {
          success: false,
          data: null,
          error: 'Username is already taken.',
        };
      }
    }

    const userRef = doc(FIREBASE_DB, 'users', userId);
    await updateDoc(userRef, updates);
    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      data: null,
      error: 'Failed to update profile. Please try again.',
    };
  }
};
