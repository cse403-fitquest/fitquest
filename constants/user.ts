import { User } from '@/types/auth';

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
  gold: 0,
  currentQuest: '',
  privacySettings: {
    isLastWorkoutPublic: true,
    isCurrentQuestPublic: true,
  },
  attributePoints: 0,
  friends: [],
  sentFriendRequests: [],
  incomingFriendRequests: [],
  createdAt: new Date(),
};
