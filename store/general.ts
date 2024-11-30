import { create } from 'zustand';

interface IGeneralStore {
  loading: boolean;

  setLoading: (loading: boolean) => void;
}

export const useGeneralStore = create<IGeneralStore>((set) => ({
  loading: false,

  setLoading: (loading) => set({ loading }),
}));
