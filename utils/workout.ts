import {
  doc,
  getDoc,
  updateDoc,
  collection,
  arrayUnion,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { APIResponse } from '@/types/general';
import { FIREBASE_DB } from '@/firebaseConfig';

/*const updateExp: (userID: string) => Promise<APIResponse> = async (userID) => {
  try {
    const itemCollection = collection(FIREBASE_DB, 'items').withConverter(
      itemConverter,
    );

  } catch (error) {
    console.error('Error updating exp:', error);

    return {
      data: null,
      success: false,
      error: 'Error updating Exp.',
    };
  }
}*/

/* converts seconds to xminutes xseconds so for display purposes*/
export const secondsToMinutes = (seconds: number) => {
  return Math.floor(seconds / 60) + 'm' + (seconds % 60) + 's';
};

export const addToTemplate = () => {};
export const removeFromTemplate = () => {};
export const submitTemplate = () => {};
export const resetTemplate = () => {};
