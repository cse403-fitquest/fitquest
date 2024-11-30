// import { EXERCISES_STUB } from '@/constants/workout';
import { ExerciseDisplay } from '@/types/workout';
import { create } from 'zustand';

interface IWorkoutStore {
  workout: {
    id: string;
    name: string;
    exercises: ExerciseDisplay[];
  };

  setWorkout: (
    fn: (workout: {
      id: string;
      name: string;
      exercises: ExerciseDisplay[];
    }) => {
      id: string;
      name: string;
      exercises: ExerciseDisplay[];
    },
  ) => void;

  // setWorkoutExercises: (
  //   fn: (prevExercises: ExerciseDisplay[]) => ExerciseDisplay[],
  // ) => void;

  // workoutName: string;

  // setWorkoutName: (name: string) => void;

  // workoutExercises: ExerciseDisplay[];

  // setWorkoutExercises: (
  //   fn: (prevExercises: ExerciseDisplay[]) => ExerciseDisplay[],
  // ) => void;
}

export const useWorkoutStore = create<IWorkoutStore>((set) => ({
  workout: {
    id: '',
    name: '',
    exercises: [],
  },

  setWorkout: (fn) => set((state) => ({ workout: fn(state.workout) })),

  // workoutName: '',

  // setWorkoutName: (name) => set({ workoutName: name }),

  // workoutExercises: [],
  //   workoutExercises: EXERCISES_STUB.map((exercise) => ({
  //     ...exercise,
  //     selected: false,
  //     sets: exercise.sets.map((set) => ({
  //       ...set,
  //       completed: false,
  //     })),
  //   })),

  // setWorkoutExercises: (fn) =>
  //   set((state) => ({ workoutExercises: fn(state.workoutExercises) })),
}));
