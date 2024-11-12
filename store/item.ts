import { Item } from '@/types/item';
import { create } from 'zustand';

interface IItemStore {
  items: Item[];

  setItems: (items: Item[]) => void;

  getItem: (id: string) => Item | null;
}

export const useItemStore = create<IItemStore>((set, get) => ({
  items: [],

  setItems: (items) => set({ items }),

  getItem: (id) => {
    return get().items.find((item) => item.id === id) || null;
  },
}));
