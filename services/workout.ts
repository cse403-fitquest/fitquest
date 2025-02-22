import { doc, getDoc, updateDoc, collection } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebaseConfig';
import { APIResponse } from '@/types/general';
import { userConverter } from './user.helper';
import { updateUserAfterExpGain } from '@/utils/workout';
import { ExerciseDisplay, Workout } from '@/types/workout';
import { User } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    // Re-add this potion after demo is done
    if (duration < 60) {
      throw new Error('Not long enough workout');
    }
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

    const expGain = duration;

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

/**
 * Finish and save workout to the user's history.
 * @param {string} userID - The user's unique ID.
 * @param {Workout} workout - The Workout to be added
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
export const finishAndSaveWorkout = async (
  userID: string,
  workout: Workout,
) => {
  try {
    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );
    const userRef = doc(userCollection, userID);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    if (!userData) {
      throw new Error('User data not found.');
    }

    const newWorkout = workout;
    const expGain = newWorkout.duration;
    const currentWorkoutMinutes = userData.activeWorkoutMinutes || 0;

    // Get new user exp amount
    const userAfterExpGain = updateUserAfterExpGain(userData, expGain);

    await updateDoc(userRef, {
      workoutHistory: [newWorkout, ...userData.workoutHistory],
      exp: userAfterExpGain.exp,
      attributePoints: userAfterExpGain.attributePoints,
      // Convert seconds to minutes
      activeWorkoutMinutes: currentWorkoutMinutes + newWorkout.duration / 60,
    });

    console.log(
      'successfully added ' + newWorkout.title + ' to user workout history.',
    );

    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error saving workout:', error);
    return {
      data: null,
      success: false,
      error: 'Error saving workout.',
    };
  }
};

/**
 * Save a workout template to the user's saved workout templates.
 * @param {string} userID - The user's unique ID.
 * @param {Workout} workout - The Workout to be added
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
export const saveWorkoutTemplate: (
  userID: string,
  workoutTemplate: Workout,
) => Promise<APIResponse> = async (userID, workout) => {
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
      return {
        data: null,
        success: false,
        error: 'User data not found.',
      };
    }

    const newWorkout = workout;

    console.log('new workout', newWorkout);

    // Check if workout template with the same title already exists
    const isWorkoutTemplateExists = userData.savedWorkoutTemplates.some(
      (workout) => workout.title === newWorkout.title,
    );

    if (isWorkoutTemplateExists) {
      return {
        data: null,
        success: false,
        error: 'Workout template with the same title already exists.',
      };
    }

    console.log('user data', userData);

    const newSavedWorkoutTemplates = [
      newWorkout,
      ...userData.savedWorkoutTemplates,
    ];

    await updateDoc(userRef, {
      savedWorkoutTemplates: newSavedWorkoutTemplates,
    });

    console.log('successfully added ' + newWorkout.title + 'to user workouts.');

    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error updating workouts:', error);

    return {
      data: null,
      success: false,
      error: 'Error updating workouts.',
    };
  }
};

/**
 * Delete a workout template from the user's saved workout templates.
 * @param {string} userID - The user's unique ID.
 * @param {string} workoutID - The ID of the workout template to be deleted.
 * @returns {APIResponse} Returns an APIResponse object.
 */
export const deleteWorkoutTemplate = async (
  userID: string,
  workoutID: string,
) => {
  try {
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

    const newWorkoutTemplates = userData.savedWorkoutTemplates.filter(
      (workout) => workout.id !== workoutID,
    );

    await updateDoc(userRef, {
      savedWorkoutTemplates: newWorkoutTemplates,
    });

    console.log('Successfully deleted workout template with id ' + workoutID);

    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error deleting workout template:', error);

    return {
      data: null,
      success: false,
      error: 'Error deleting workout template.',
    };
  }
};

/**
 * Update the active workout in async storage.
 * @param {Workout} workout - The active workout.
 * @param {User} user - The user.
 */
export const updateActiveWorkout = async (
  workout: {
    id: string;
    name: string;
    exercises: ExerciseDisplay[];
    startedAt: Date;
    isSuggested?: boolean;
  },
  user: User,
) => {
  const storedWorkout = { ...workout };

  // Verify that workout is valid
  if (!storedWorkout) {
    console.error('Workout not found');
    return;
  }

  // Store active workout in async storage
  AsyncStorage.setItem(
    `activeWorkout-${user.id}`,
    JSON.stringify(storedWorkout),
  );
};
