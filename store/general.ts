import { Audio } from 'expo-av';
import { create } from 'zustand';

interface IGeneralStore {
  loading: boolean;

  setLoading: (loading: boolean) => void;

  sound: Audio.Sound | null;

  setSound: (sound: Audio.Sound | null) => void;
}

export const useGeneralStore = create<IGeneralStore>((set) => ({
  loading: false,

  setLoading: (loading) => set({ loading }),

  sound: null,

  setSound: (sound) => set({ sound }),
}));
