import { FIREBASE_DB } from '@/firebaseConfig';
import { GetUserByUsernameResponse } from '@/types/social';
import { User } from '@/types/user';
import { Workout } from '@/types/workout';
import { fromTimestampToDate } from '@/utils/general';
import {
  collection,
  getDocs,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
} from 'firebase/firestore';

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

export const getUserByUsername: (
  username: string,
) => Promise<GetUserByUsernameResponse> = async (username) => {
  const userRef = collection(FIREBASE_DB, 'users').withConverter(userConverter);
  const q = query(userRef, where('profileInfo.username', '==', username));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return {
      success: false,
      error: 'User not found.',
      data: null,
    };
  }

  return {
    success: true,
    error: null,
    data: querySnapshot.docs[0].data(),
  };
};
