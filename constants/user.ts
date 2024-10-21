import { User } from '@/types/auth';

export const BASE_USER: User = {
  id: '',
  profileInfo: {
    email: '',
    username: '',
    age: 0,
    height: 0,
    weight: 0,
  },
  spriteID: '',
  attributes: { power: 0, speed: 0, health: 0 },
  exp: 0,
  gold: 0,
  createdAt: 0,
};
