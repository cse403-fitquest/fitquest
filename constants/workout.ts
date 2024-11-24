import { Exercise, ExerciseTag } from '@/types/workout';

export enum MuscleGroup {
  CHEST = 'Chest',
  BACK = 'Back',
  LEGS = 'Legs',
  CORE = 'Core',
  CARDIO = 'Cardio',
}

export const EXERCISES_STUB: Exercise[] = [
  {
    id: '',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [
      {
        id: '',
        weight: 100,
        reps: 10,
        distance: 0,
        time: 0,
      },
      {
        id: '',
        weight: 100,
        reps: 8,
        distance: 0,
        time: 0,
      },
    ],
  },
  {
    id: '',
    name: 'Jogging',
    muscleGroup: 'Cardio',
    tags: [ExerciseTag.DISTANCE, ExerciseTag.TIME],
    sets: [
      {
        id: '',
        weight: 0,
        reps: 0,
        distance: 5,
        time: 30,
      },
      {
        id: '',
        weight: 0,
        reps: 0,
        distance: 5,
        time: 30,
      },
    ],
  },
];

export const ALL_EXERCISES_STUB: Exercise[] = [
  // CHEST
  {
    id: '',
    name: 'Push Up',
    muscleGroup: MuscleGroup.CHEST,
    tags: [ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Push Up (Weighted)',
    muscleGroup: MuscleGroup.CHEST,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Bench Press',
    muscleGroup: MuscleGroup.CHEST,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },

  // BACK
  {
    id: '',
    name: 'Pull Up',
    muscleGroup: MuscleGroup.BACK,
    tags: [ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Pull Up (Weighted)',
    muscleGroup: MuscleGroup.BACK,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Deadlift',
    muscleGroup: MuscleGroup.BACK,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },

  // LEGS
  {
    id: '',
    name: 'Squat',
    muscleGroup: MuscleGroup.LEGS,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Lunge',
    muscleGroup: MuscleGroup.LEGS,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },

  // Core
  {
    id: '',
    name: 'Plank',
    muscleGroup: MuscleGroup.CORE,
    tags: [ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Sit Up',
    muscleGroup: MuscleGroup.CORE,
    tags: [ExerciseTag.REPS],
    sets: [],
  },

  // Cardio
  {
    id: '',
    name: 'Walking',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.DISTANCE, ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Walking (Distance Only)',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.DISTANCE],
    sets: [],
  },
  {
    id: '',
    name: 'Walking (Time Only)',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Jogging',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.DISTANCE, ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Jogging (Distance Only)',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.DISTANCE],
    sets: [],
  },
  {
    id: '',
    name: 'Jogging (Time Only)',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Cycling',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.DISTANCE, ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Cycling (Distance Only)',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.DISTANCE],
    sets: [],
  },
  {
    id: '',
    name: 'Cycling (Time Only)',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.TIME],
    sets: [],
  },
];
