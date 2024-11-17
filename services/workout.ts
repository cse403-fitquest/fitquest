import { doc, getDoc, updateDoc, collection } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebaseConfig';
import { APIResponse } from '@/types/general';
import { userConverter } from './user';
import { updateUserAfterExpGain } from '@/utils/workout';

// Function to handle the updating of exp
/**
 * Purchase an item for the user.
 * @param {string} userID - The user's unique ID.
 * @param {number} duration - The duration worked out
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
export const updateEXP: (
  userID: string,
  duration: number,
) => Promise<APIResponse> = async (userID, duration) => {
  try {
    // // Re-add this potion after demo is done
    // if (duration < 600) {
    //     throw new Error('Not long enough workout');
    // }
    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    // Get user data
    const userRef = doc(userCollection, userID);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    if (!userData) {
      throw new Error('User data not found.');
    }

    const expGain = duration * 1000;

    // Get new user exp amount
    const userAfterExpGain = updateUserAfterExpGain(userData, expGain);

    await updateDoc(userRef, {
      exp: userAfterExpGain.exp,
      attributePoints: userAfterExpGain.attributePoints,
    });

    console.log('exp successfully incremented by ' + expGain + 'xp.');

    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error updating exp:', error);

    return {
      data: null,
      success: false,
      error: 'Error updating exp.',
    };
  }
};
