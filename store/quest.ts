import { create } from 'zustand';
import { Quest, QuestProgress } from '@/types/quest';

interface QuestStore {
  currentQuest: QuestProgress | null;
  availableQuests: Quest[];
  setCurrentQuest: (quest: QuestProgress | null) => void;
  setAvailableQuests: (quests: Quest[]) => void;
  updateQuestProgress: (progress: number) => void;
  resetQuest: () => void;
}

export const useQuestStore = create<QuestStore>((set) => ({
  currentQuest: null,
  availableQuests: [],
  setCurrentQuest: (quest) => set({ currentQuest: quest }),
  setAvailableQuests: (quests) => set({ availableQuests: quests }),
  updateQuestProgress: (progress) =>
    set((state) => ({
      currentQuest: state.currentQuest
        ? { ...state.currentQuest, progress }
        : null,
    })),
  resetQuest: () => set({ currentQuest: null }),
}));
