import { create } from 'zustand';

interface IOnboardingStateStore {
  frequency: 0 | 1 | 2 | 3 | 4;

  length: 0 | 1 | 2 | 3 | 4;

  intensity: 0 | 1 | 2 | 3 | 4;

  experience: 0 | 1 | 2 | 3 | 4;

  setFrequency: (frequency: 0 | 1 | 2 | 3 | 4) => void;

  setLength: (length: 0 | 1 | 2 | 3 | 4) => void;

  setIntensity: (intensity: 0 | 1 | 2 | 3 | 4) => void;

  setExperience: (experience: 0 | 1 | 2 | 3 | 4) => void;

  resetStore: () => void;
}

export const useOnboardingStore = create<IOnboardingStateStore>((set) => ({
  frequency: 0,

  length: 0,

  intensity: 0,

  experience: 0,

  setFrequency: (frequency) => set({ frequency }),

  setLength: (length) => set({ length }),

  setIntensity: (intensity) => set({ intensity }),

  setExperience: (experience) => set({ experience }),

  resetStore: () =>
    set({
      frequency: 0,

      length: 0,

      intensity: 0,

      experience: 0,
    }),
}));
