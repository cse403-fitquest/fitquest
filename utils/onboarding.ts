import { FitnessLevel } from '@/types/onboarding';

export const computeFitnessLevel = (
  frequency: 0 | 1 | 2 | 3 | 4,
  length: 0 | 1 | 2 | 3 | 4,
  intensity: 0 | 1 | 2 | 3 | 4,
  experience: 0 | 1 | 2 | 3 | 4,
): FitnessLevel => {
  const score = Math.round((frequency + length + intensity + experience) / 4);

  switch (score) {
    case 1:
      return FitnessLevel.BEGINNER;
    case 2:
      return FitnessLevel.NOVICE;
    case 3:
      return FitnessLevel.INTERMEDIATE;
    case 4:
      return FitnessLevel.ADVANCED;
    default:
      return FitnessLevel.BEGINNER;
  }
};
