import { Quest } from '@/types/quest';
import { create } from 'zustand';

interface IQuestStore {
  availableQuests: Quest[];
  currentQuest: Quest | null;

  setAvailableQuests: (quests: Quest[]) => void;
  setCurrentQuest: (quest: Quest | null) => void;
  resetQuest: () => void;
}

export const useQuestStore = create<IQuestStore>((set) => ({
  availableQuests: [],
  currentQuest: null,

  setAvailableQuests: (quests) => set({ availableQuests: quests }),
  setCurrentQuest: (quest) => set({ currentQuest: quest }),
  resetQuest: () => set({ currentQuest: null }),
}));
