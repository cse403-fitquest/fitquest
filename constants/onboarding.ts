import { FitnessLevel } from '@/types/onboarding';

export const ONBOARDING_FITNESS_LEVEL_POINTS: Record<FitnessLevel, number> = {
  BEGINNER: 1,
  NOVICE: 3,
  INTERMEDIATE: 6,
  ADVANCED: 10,
} as const;

export const BASE_ATTRIBUTES = {
  power: 5,
  speed: 5,
  health: 5,
} as const;
