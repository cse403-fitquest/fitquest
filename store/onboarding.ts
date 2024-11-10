import { create } from 'zustand';

interface IOnboardingStateStore {
  frequency: 1 | 2 | 3 | 4;

  length: 1 | 2 | 3 | 4;

  intensity: 1 | 2 | 3 | 4;

  experience: 1 | 2 | 3 | 4;

  setFrequency: (frequency: 1 | 2 | 3 | 4) => void;

  setLength: (length: 1 | 2 | 3 | 4) => void;

  setIntensity: (intensity: 1 | 2 | 3 | 4) => void;

  setExperience: (experience: 1 | 2 | 3 | 4) => void;

  resetStore: () => void;
}

export const useOnboardingStore = create<IOnboardingStateStore>((set) => ({
  frequency: 1,

  length: 1,

  intensity: 1,

  experience: 1,

  setFrequency: (frequency) => set({ frequency }),

  setLength: (length) => set({ length }),

  setIntensity: (intensity) => set({ intensity }),

  setExperience: (experience) => set({ experience }),

  resetStore: () =>
    set({
      frequency: 1,

      length: 1,

      intensity: 1,

      experience: 1,
    }),
}));
