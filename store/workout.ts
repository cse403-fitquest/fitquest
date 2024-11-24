import { ExerciseDisplay } from '@/types/workout';
import { create } from 'zustand';

interface IWorkoutStore {
  workoutExercises: ExerciseDisplay[];

  setWorkoutExercises: (
    fn: (prevExercises: ExerciseDisplay[]) => ExerciseDisplay[],
  ) => void;
}

export const useWorkoutStore = create<IWorkoutStore>((set) => ({
  workoutExercises: [],

  setWorkoutExercises: (fn) =>
    set((state) => ({ workoutExercises: fn(state.workoutExercises) })),
}));
