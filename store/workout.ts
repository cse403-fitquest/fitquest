// import { EXERCISES_STUB } from '@/constants/workout';
import { ExerciseDisplay } from '@/types/workout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface IWorkoutStore {
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
