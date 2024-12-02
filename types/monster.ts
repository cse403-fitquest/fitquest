import { AnimatedSpriteID } from '@/constants/sprite';

export interface Monster {
  monsterId: string;
  name: string;
  attributes: {
    health: number;
    power: number;
    speed: number;
  };
  spriteId: AnimatedSpriteID;
  associatedQuest: string;
  createdAt?: string;
}

export interface MonsterResponse {
  success: boolean;
  data?: { monsters: Monster[] } | null;
  error?: string;
}
