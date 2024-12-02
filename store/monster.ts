import { Monster } from '@/types/monster';
import { create } from 'zustand';

interface IMonsterStore {
  availableMonsters: Monster[];
  currentMonster: Monster | null;

  setAvailableMonsters: (monsters: Monster[]) => void;
  setCurrentMonster: (monster: Monster | null) => void;
  resetMonster: () => void;
}

export const useMonsterStore = create<IMonsterStore>((set) => ({
  availableMonsters: [],
  currentMonster: null,

  setAvailableMonsters: (monsters) => set({ availableMonsters: monsters }),
  setCurrentMonster: (monster) => set({ currentMonster: monster }),
  resetMonster: () => set({ currentMonster: null }),
}));
