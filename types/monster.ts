import { AnimatedSpriteID } from '@/constants/sprite';
import { APIResponse } from './general';

export type CreateMonsterResponse = APIResponse & {};

export type GetMonsterResponse = APIResponse & {
  data: Monster | null;
};

export type Monster = {
  monsterId: string;
  name: string;
  spriteID: AnimatedSpriteID;
  attributes: { health: number; power: number; speed: number };
  createdAt: string;
  associatedQuest: string;
};
