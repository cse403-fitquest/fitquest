import { AnimatedSpriteID } from '@/constants/sprite';
import { APIResponse } from './general';
import { Workout, WorkoutTemplate } from './workout';
export type CreateUserResponse = APIResponse & {};

export type GetUserResponse = APIResponse & {
  data: {
    user: User;
  } | null;
};

export type User = {
  id: string;
  profileInfo: {
    email: string;
    username: string;
    age: number;
    height: number;
    weight: number;
  };
  spriteID: AnimatedSpriteID;
  attributes: { power: number; speed: number; health: number };
  exp: number;
  gold: number;
  attributePoints: number;
  currentQuest: {
    id: string;
    progress: Record<string, number>;
  };
  equippedItems: string[]; // Array of equipped equipment IDs
  equipments: string[]; // Array of all user's equipment IDs
  consumables: string[]; // Array of all user's consumables IDs
  savedWorkouts: WorkoutTemplate[]; // Array of all users' workout templates
  savedWorkoutTemplates: Workout[];
  activeWorkoutMinutes: number;
  activeWorkout: Workout | null;
  workoutHistory: Workout[];
  privacySettings: {
    isLastWorkoutPublic: boolean;
    isCurrentQuestPublic: boolean;
  };
  createdAt: Date;
  isOnboardingCompleted: boolean;
};
