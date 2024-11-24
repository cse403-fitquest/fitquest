import { Exercise, ExerciseDisplay, ExerciseTag } from '@/types/workout';

export const BASE_EXERCISE_DISPLAY: ExerciseDisplay = {
  id: '',
  name: '',
  muscleGroup: '',
  tags: [],
  sets: [],
};

export const BASE_EXERCISE_SET_DISPLAY = {
  id: '',
  weight: 0,
  reps: 0,
  distance: 0,
  time: 0,
  completed: false,
};

export enum MuscleGroup {
  CHEST = 'Chest',
  BACK = 'Back',
  ARMS = 'Arms',
  LEGS = 'Legs',
  CORE = 'Core',
  CARDIO = 'Cardio',
}

export const EXERCISES_STUB: Exercise[] = [
  {
    id: '3234',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [
      {
        id: 'garg',
        weight: 100,
        reps: 10,
        distance: 0,
        time: 0,
      },
      {
        id: 'arga',
        weight: 100,
        reps: 8,
        distance: 0,
        time: 0,
      },
    ],
  },
  {
    id: '254',
    name: 'Jogging',
    muscleGroup: 'Cardio',
    tags: [ExerciseTag.DISTANCE, ExerciseTag.TIME],
    sets: [
      {
        id: 'gsg',
        weight: 0,
        reps: 0,
        distance: 5,
        time: 30,
      },
      {
        id: 'hdfh',
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
    name: 'Bench Press',
    muscleGroup: MuscleGroup.CHEST,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Incline Bench Press',
    muscleGroup: MuscleGroup.CHEST,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Decline Bench Press',
    muscleGroup: MuscleGroup.CHEST,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Push Up',
    muscleGroup: MuscleGroup.CHEST,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Chest Dip',
    muscleGroup: MuscleGroup.CHEST,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },

  // BACK
  {
    id: '',
    name: 'Deadlift',
    muscleGroup: MuscleGroup.BACK,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Lat Pulldown',
    muscleGroup: MuscleGroup.BACK,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Row (Barbell)',
    muscleGroup: MuscleGroup.BACK,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Row (Dumbbell)',
    muscleGroup: MuscleGroup.BACK,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Pull Up',
    muscleGroup: MuscleGroup.BACK,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Chin Up',
    muscleGroup: MuscleGroup.BACK,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Inverted Row',
    muscleGroup: MuscleGroup.BACK,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Shrug',
    muscleGroup: MuscleGroup.BACK,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },

  // ARMS
  {
    id: '',
    name: 'Bicep Curl',
    muscleGroup: MuscleGroup.ARMS,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Tricep Extension',
    muscleGroup: MuscleGroup.ARMS,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Hammer Curl',
    muscleGroup: MuscleGroup.ARMS,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Tricep Dip',
    muscleGroup: MuscleGroup.ARMS,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Skull Crusher',
    muscleGroup: MuscleGroup.ARMS,
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
  {
    id: '',
    name: 'Pistol Squat',
    muscleGroup: MuscleGroup.LEGS,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Leg Press',
    muscleGroup: MuscleGroup.LEGS,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Leg Extension',
    muscleGroup: MuscleGroup.LEGS,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Leg Curl',
    muscleGroup: MuscleGroup.LEGS,
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Calf Raise',
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
  {
    id: '',
    name: 'Russian Twist',
    muscleGroup: MuscleGroup.CORE,
    tags: [ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Ab Wheel Rollout (Assisted)',
    muscleGroup: MuscleGroup.CORE,
    tags: [ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Ab Wheel Rollout',
    muscleGroup: MuscleGroup.CORE,
    tags: [ExerciseTag.REPS],
    sets: [],
  },
  {
    id: '',
    name: 'Dragon Flag',
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
    name: 'Jogging',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.DISTANCE, ExerciseTag.TIME],
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
    name: 'Swimming',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.DISTANCE, ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Burpee',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Jump Rope',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.TIME],
    sets: [],
  },
  {
    id: '',
    name: 'Boxing',
    muscleGroup: MuscleGroup.CARDIO,
    tags: [ExerciseTag.TIME],
    sets: [],
  },
];
