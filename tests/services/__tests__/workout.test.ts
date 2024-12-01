// __tests__/workout.test.ts

import { BASE_USER } from '@/constants/user';
import { Exercise, ExerciseTag, Workout } from '@/types/workout';
import { APIResponse } from '@/types/general';
import { deleteWorkoutTemplate, saveWorkoutTemplate } from '@/services/workout';
import { updateDoc, getDoc } from 'firebase/firestore';

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
    savedWorkouts: [],
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
    savedWorkouts: [exampleWorkout],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests for saving and editing workouts
  describe('saving and editing workout templates', () => {
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
});
