import { Exercise, ExerciseTag } from '@/types/workout';

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
    muscleGroup: 'Chest',
    tags: [ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Push Up (Weighted)',
    muscleGroup: 'Chest',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },

  // BACK
  {
    id: '',
    name: 'Pull Up',
    muscleGroup: 'Back',
    tags: [ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Pull Up (Weighted)',
    muscleGroup: 'Back',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Deadlift',
    muscleGroup: 'Back',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },

  // LEGS
  {
    id: '',
    name: 'Squat',
    muscleGroup: 'Legs',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Lunge',
    muscleGroup: 'Legs',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },

  // Core
  {
    id: '',
    name: 'Plank',
    muscleGroup: 'Core',
    tags: [ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Sit Up',
    muscleGroup: 'Core',
    tags: [ExerciseTag.REPS],
    sets: [],
  },

  // Cardio
  {
    id: '',
    name: 'Walking',
    muscleGroup: 'Cardio',
    tags: [ExerciseTag.DISTANCE, ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Walking (Distance Only)',
    muscleGroup: 'Cardio',
    tags: [ExerciseTag.DISTANCE],
    sets: [],
  },
  {
    id: '',
    name: 'Walking (Time Only)',
    muscleGroup: 'Cardio',
    tags: [ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Jogging',
    muscleGroup: 'Cardio',
    tags: [ExerciseTag.DISTANCE, ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Jogging (Distance Only)',
    muscleGroup: 'Cardio',
    tags: [ExerciseTag.DISTANCE],
    sets: [],
  },
  {
    id: '',
    name: 'Jogging (Time Only)',
    muscleGroup: 'Cardio',
    tags: [ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Cycling',
    muscleGroup: 'Cardio',
    tags: [ExerciseTag.DISTANCE, ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Cycling (Distance Only)',
    muscleGroup: 'Cardio',
    tags: [ExerciseTag.DISTANCE],
    sets: [],
  },
  {
    id: '',
    name: 'Cycling (Time Only)',
    muscleGroup: 'Cardio',
    tags: [ExerciseTag.TIME],
    sets: [],
  },
];
