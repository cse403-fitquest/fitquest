import { create } from 'zustand';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { Monster } from '@/types/monster';

interface MonsterStore {
  currentMonster: Monster | null;
  isLoading: boolean;
  error: string | null;
  fetchMonster: (monsterId: string) => Promise<void>;
}

export const useMonsterStore = create<MonsterStore>((set) => ({
  currentMonster: null,
  isLoading: false,
  error: null,
  fetchMonster: async (monsterId: string) => {
    try {
      set({ isLoading: true });
      // Assuming 'db' is a Firestore instance that needs to be imported or defined
      const db = getFirestore(); // Example of how to import or define 'db'
      const monsterRef = doc(db, 'monsters', monsterId);
      const monsterSnap = await getDoc(monsterRef);

      if (monsterSnap.exists()) {
        set({ currentMonster: monsterSnap.data() as Monster, error: null });
      } else {
        set({ error: 'Monster not found' });
      }
    } catch {
      set({ error: 'Failed to fetch monster' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
