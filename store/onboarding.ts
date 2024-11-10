import { BASE_ATTRIBUTES } from '@/constants/onboarding';
import { AnimatedSpriteID } from '@/constants/sprite';
import { FitnessLevel } from '@/types/onboarding';
import { create } from 'zustand';

interface IOnboardingStateStore {
  frequency: 1 | 2 | 3 | 4;

  setFrequency: (frequency: 1 | 2 | 3 | 4) => void;

  length: 1 | 2 | 3 | 4;

  setLength: (length: 1 | 2 | 3 | 4) => void;

  intensity: 1 | 2 | 3 | 4;

  setIntensity: (intensity: 1 | 2 | 3 | 4) => void;

  experience: 1 | 2 | 3 | 4;

  setExperience: (experience: 1 | 2 | 3 | 4) => void;

  fitnessLevel: FitnessLevel;

  setFitnessLevel: (fitnessLevel: FitnessLevel) => void;

  currentPoints: number;

  setCurrentPoints: (currentPoints: number) => void;

  attributes: {
    power: number;
    speed: number;
    health: number;
  };

  setAttributes: (attributes: {
    power: number;
    speed: number;
    health: number;
  }) => void;

  spriteID: AnimatedSpriteID;

  setSpriteID: (spriteID: AnimatedSpriteID) => void;

  resetStore: () => void;
}

export const useOnboardingStore = create<IOnboardingStateStore>((set) => ({
  frequency: 1,

  setFrequency: (frequency) => set({ frequency }),

  length: 1,

  setLength: (length) => set({ length }),

  intensity: 1,

  setIntensity: (intensity) => set({ intensity }),

  experience: 1,

  setExperience: (experience) => set({ experience }),

  fitnessLevel: FitnessLevel.BEGINNER,

  setFitnessLevel: (fitnessLevel) => set({ fitnessLevel }),

  currentPoints: 0,

  setCurrentPoints: (currentPoints) => set({ currentPoints }),

  attributes: {
    power: 5,
    speed: 5,
    health: 5,
  },

  setAttributes: (attributes) => set({ attributes: attributes }),

  spriteID: AnimatedSpriteID.HERO_01,

  setSpriteID: (spriteID) => set({ spriteID }),

  resetStore: () =>
    set({
      frequency: 1,
      length: 1,
      intensity: 1,
      experience: 1,
      fitnessLevel: FitnessLevel.BEGINNER,
      currentPoints: 0,
      attributes: {
        ...BASE_ATTRIBUTES,
      },
      spriteID: AnimatedSpriteID.HERO_01,
    }),
}));
