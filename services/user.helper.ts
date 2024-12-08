import { FIREBASE_DB } from '@/firebaseConfig';
import { GetUserByUsernameResponse } from '@/types/social';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { userConverter } from './user';

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
