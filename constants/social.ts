import { Friend } from '@/types/social';

export const BASE_FRIEND: Friend = {
  id: '',
  profileInfo: {
    email: '',
    username: '',
  },
  currentQuest: '',
  privacySettings: {
    isLastWorkoutPublic: true,
    isCurrentQuestPublic: true,
  },
};
