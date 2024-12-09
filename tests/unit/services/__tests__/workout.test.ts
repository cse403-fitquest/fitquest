// __tests__/workout.test.ts

import { BASE_USER } from '@/constants/user';
import { Exercise, ExerciseTag, Workout } from '@/types/workout';
import { APIResponse } from '@/types/general';
import {
  deleteWorkoutTemplate,
  saveWorkoutTemplate,
  updateActiveWorkout,
  updateEXP,
} from '@/services/workout';
import { updateDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Firebase Firestore
jest.mock('@/firebaseConfig', () => ({
  FIREBASE_DB: {},
}));

// require async storage mock
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock Firebase Firestore methods
jest.mock('firebase/firestore', () => ({
  collection: jest.fn((_db, collectionName) => ({
    withConverter: jest.fn(() => ({
      path: `${collectionName}`,
    })),
  })),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  writeBatch: jest.fn(() => ({
    set: jest.fn(),
    commit: jest.fn(),
  })),
  doc: jest.fn((collectionRef, id) => ({
    path: `${collectionRef.path}/${id}`,
  })),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn((item) => [item]),
}));

describe('Workout Service Functions', () => {
  //   const mockGetDoc = getDocs as jest.Mock;
  //   const mockDeleteDoc = deleteDoc as jest.Mock;
  //   const mockWriteBatch = writeBatch as jest.Mock;
  const mockGetDoc = getDoc as jest.Mock;
  const mockUpdateDoc = updateDoc as jest.Mock;

  // exercises for chest example
  const benchPress: Exercise = {
    id: 'benchpress',
    name: 'Bench Press',
    muscleGroup: 'chest',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [
      {
        id: 'set1',
        weight: 135,
        reps: 10,
        distance: 0,
        time: 0,
      },
      {
        id: 'set2',
        weight: 135,
        reps: 9,
        distance: 0,
        time: 0,
      },
      {
        id: 'set3',
        weight: 135,
        reps: 8,
        distance: 0,
        time: 0,
      },
    ],
  };
  const dumbellFly: Exercise = {
    id: 'dumbellFly',
    name: 'Dumbell Fly',
    muscleGroup: 'chest',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [
      {
        id: 'set1',
        weight: 65,
        reps: 10,
        distance: 0,
        time: 0,
      },
      {
        id: 'set2',
        weight: 65,
        reps: 9,
        distance: 0,
        time: 0,
      },
      {
        id: 'set3',
        weight: 55,
        reps: 8,
        distance: 0,
        time: 0,
      },
    ],
  };
  const chestDip: Exercise = {
    id: 'chestDip',
    name: 'Chest Dip',
    muscleGroup: 'chest',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [
      {
        id: 'set1',
        weight: 25,
        reps: 10,
        distance: 0,
        time: 0,
      },
      {
        id: 'set2',
        weight: 25,
        reps: 9,
        distance: 0,
        time: 0,
      },
      {
        id: 'set3',
        weight: 25,
        reps: 8,
        distance: 0,
        time: 0,
      },
    ],
  };

  // example user data
  const userData = {
    ...BASE_USER,
    id: 'user1234',
    savedWorkoutTemplates: [],
  };

  // basic chest workout
  const exampleWorkout: Workout = {
    id: '123abc',
    title: 'chest day',
    duration: 3600,
    startedAt: new Date(),
    exercises: [benchPress, dumbellFly, chestDip],
  };

  const exampleWorkoutID = '123abc';

  // another user with workout data
  const userDataWithWorkout = {
    ...BASE_USER,
    id: 'userwithworkout',
    savedWorkoutTemplates: [exampleWorkout],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests for saving and editing workouts
  describe('saving, editingm, and deleting workout templates', () => {
    const userId = 'user1234';

    it('should add to saved workouts successfully', async () => {
      mockGetDoc.mockImplementation((ref) => {
        if (ref.path.includes('users')) return { data: () => userData };
      });

      mockUpdateDoc.mockResolvedValue(undefined);

      const response: APIResponse = await saveWorkoutTemplate(
        userId,
        exampleWorkout,
      );

      expect(response).toEqual({
        success: true,
        data: null,
        error: null,
      });
    });

    // test save if name already exists
    it('should fail to add if user already has workout with identical name', async () => {
      mockGetDoc.mockImplementation((ref) => {
        if (ref.path.includes('users'))
          return { data: () => userDataWithWorkout };
      });

      mockUpdateDoc.mockResolvedValue(undefined);

      const response: APIResponse = await saveWorkoutTemplate(
        userDataWithWorkout.id,
        exampleWorkout,
      );

      expect(response.success).toEqual(false);
    });

    // test delete workouts
    it('should delete savedworkout successfully', async () => {
      mockGetDoc.mockImplementation((ref) => {
        if (ref.path.includes('users'))
          return { data: () => userDataWithWorkout };
      });

      mockUpdateDoc.mockResolvedValue(undefined);

      const response: APIResponse = await deleteWorkoutTemplate(
        userDataWithWorkout.id,
        exampleWorkoutID,
      );

      expect(response).toEqual({
        success: true,
        data: null,
        error: null,
      });
    });

    // test delete on invalid ID
    it('should pass if deleting workout that does not exist', async () => {
      const falseworkoutID = 'johnnytables';
      mockGetDoc.mockImplementation((ref) => {
        if (ref.path.includes('users'))
          return { data: () => userDataWithWorkout };
      });

      mockUpdateDoc.mockResolvedValue(undefined);

      const response: APIResponse = await deleteWorkoutTemplate(
        userDataWithWorkout.id,
        falseworkoutID,
      );

      expect(response.success).toEqual(true);
    });
  });

  describe('updating exp', () => {
    const hourWorkoutDuration = 3600;
    const negativeDuration = -5;
    const shortDuration = 25;
    it('should pass when updating exp', async () => {
      mockGetDoc.mockImplementation((ref) => {
        if (ref.path.includes('users'))
          return { data: () => userDataWithWorkout };
      });

      mockUpdateDoc.mockResolvedValue(undefined);

      const response: APIResponse = await updateEXP(
        userDataWithWorkout.id,
        hourWorkoutDuration,
      );

      expect(response.success).toEqual(true);

      // Check if user's exp has been updated correctly
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.objectContaining({}), {
        exp: 500,
        attributePoints: 2,
      });
    });

    it('should fail when duration negative', async () => {
      mockGetDoc.mockImplementation((ref) => {
        if (ref.path.includes('users'))
          return { data: () => userDataWithWorkout };
      });

      mockUpdateDoc.mockResolvedValue(undefined);

      const response: APIResponse = await updateEXP(
        userDataWithWorkout.id,
        negativeDuration,
      );

      expect(response.success).toEqual(false);
    });

    it('should fail when duration less than minute', async () => {
      mockGetDoc.mockImplementation((ref) => {
        if (ref.path.includes('users'))
          return { data: () => userDataWithWorkout };
      });

      mockUpdateDoc.mockResolvedValue(undefined);

      const response: APIResponse = await updateEXP(
        userDataWithWorkout.id,
        shortDuration,
      );

      expect(response.success).toEqual(false);
    });

    it('should fail when no user found', async () => {
      const invalidUserid = 'namenamename';
      mockGetDoc.mockImplementation((ref) => {
        if (ref.path.includes('users'))
          return { data: () => userDataWithWorkout };
      });

      mockUpdateDoc.mockResolvedValue(undefined);

      const response: APIResponse = await updateEXP(
        invalidUserid,
        shortDuration,
      );

      expect(response.success).toEqual(false);
    });
  });

  jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
  }));
  describe('updating active workout', () => {
    const mockWorkout = {
      id: 'workout1',
      name: 'Morning Workout',
      exercises: [],
      startedAt: new Date(),
      isSuggested: true,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should store the active workout in AsyncStorage', async () => {
      await updateActiveWorkout(mockWorkout, userData);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `activeWorkout-${userData.id}`,
        JSON.stringify(mockWorkout),
      );
    });
  });
});
