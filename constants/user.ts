import { User } from '@/types/user';
import { AnimatedSpriteID } from './sprite';

export const BASE_USER: User = {
  id: '',
  profileInfo: {
    email: '',
    username: '',
    age: 20,
    height: 5.9,
    weight: 150,
  },
  spriteID: AnimatedSpriteID.HERO_04,
  attributes: { power: 5, speed: 5, health: 5 },
  exp: 0,
  gold: 100,
  currentQuest: {
    id: '',
    progress: {},
  },
  equippedItems: [],
  equipments: [],
  consumables: [],
  savedWorkouts: [],
  savedWorkoutTemplates: [],
  activeWorkout: null,
  activeWorkoutMinutes: 0,
  workoutHistory: [],
  privacySettings: {
    isLastWorkoutPublic: true,
    isCurrentQuestPublic: true,
  },
  attributePoints: 0,
  createdAt: new Date(),
  isOnboardingCompleted: false,
};
