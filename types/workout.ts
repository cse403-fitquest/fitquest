export const enum ExerciseTag {
  WEIGHT = 'WEIGHT',
  REPS = 'REPS',
  DISTANCE = 'DISTANCE',
  TIME = 'TIME',
}

export type ExerciseSet = {
  id: string;
  weight: number;
  reps: number;
  distance: number;
  time: number;
};

export type ExerciseSetDisplay = {
  id: string;
  weight: number;
  reps: number;
  distance: number;
  time: number;
  completed: boolean;
};

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  tags: ExerciseTag[];
  sets: ExerciseSet[];
};

export type ExerciseDisplay = Omit<Exercise, 'sets'> & {
  sets: ExerciseSetDisplay[];
};

export type WorkoutTemplate = {
  title: string;
  startedAt: Date;
  duration: number;
  exercises: Exercise[];
};
