// import { EXERCISES_STUB } from '@/constants/workout';
import { ExerciseDisplay } from '@/types/workout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface IWorkoutStore {
  // Used for storing the active workout
  workout: {
    id: string;
    name: string;
    exercises: ExerciseDisplay[];
    startedAt: Date;
    isSuggested?: boolean;
  };

  setWorkout: (
    fn: (workout: {
      id: string;
      name: string;
      exercises: ExerciseDisplay[];
      startedAt: Date;
      isSuggested?: boolean;
    }) => {
      id: string;
      name: string;
      exercises: ExerciseDisplay[];
      startedAt: Date;
      isSuggested?: boolean;
    },
  ) => void;

  // Used for displaying workout details
  workoutDisplay: {
    id: string;
    name: string;
    exercises: ExerciseDisplay[];
    startedAt: Date;
    isSuggested?: boolean;
  };

  setWorkoutDisplay: (
    fn: (workout: {
      id: string;
      name: string;
      exercises: ExerciseDisplay[];
      startedAt: Date;
      isSuggested?: boolean;
    }) => {
      id: string;
      name: string;
      exercises: ExerciseDisplay[];
      startedAt: Date;
      isSuggested?: boolean;
    },
  ) => void;

  // Used for clearing the active workout
  clearWorkout: () => void;
}

export const useWorkoutStore = create<IWorkoutStore>((set) => ({
  workout: {
    id: '',
    name: '',
    exercises: [],
    startedAt: new Date(),
    isSuggested: false,
  },

  setWorkout: (fn) =>
    set((state) => {
      AsyncStorage.setItem('activeWorkout', JSON.stringify(fn(state.workout)));
      return { workout: fn(state.workout) };
    }),

  workoutDisplay: {
    id: '',
    name: '',
    exercises: [],
    startedAt: new Date(),
    isSuggested: false,
  },

  setWorkoutDisplay: (fn) =>
    set((state) => {
      return { workoutDisplay: fn(state.workoutDisplay) };
    }),

  clearWorkout: () =>
    set((state) => {
      AsyncStorage.removeItem('activeWorkout');
      return {
        workout: {
          ...state.workout,
          id: '',
          name: '',
          exercises: [],
          startedAt: new Date(),
          isSuggested: false,
        },
      };
    }),
}));
