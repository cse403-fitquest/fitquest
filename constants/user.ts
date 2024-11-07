import { User } from '@/types/user';

export const BASE_USER: User = {
  id: '',
  profileInfo: {
    email: '',
    username: '',
    age: 20,
    height: 5.9,
    weight: 150,
  },
  spriteID: '',
  attributes: { power: 5, speed: 5, health: 5 },
  exp: 0,
  gold: 100,
  currentQuest: '',
  equippedItems: [],
  items: [],
  privacySettings: {
    isLastWorkoutPublic: true,
    isCurrentQuestPublic: true,
  },
  attributePoints: 0,
  createdAt: new Date(),
};
