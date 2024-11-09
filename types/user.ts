import { APIResponse } from './general';
import { Item } from './item';

export type CreateUserResponse = APIResponse & {};

export type GetUserResponse = APIResponse & {
  data: {
    user: User;
  } | null;
};

export type User = {
  id: string;
  profileInfo: {
    email: string;
    username: string;
    age: number;
    height: number;
    weight: number;
  };
  spriteID: string;
  attributes: { power: number; speed: number; health: number };
  exp: number;
  gold: number;
  attributePoints: number;
  currentQuest: string;
  equippedItems: Item[]; // Array of equipped equipment
  equipments: Item[]; // Array of all user's equipment
  consumables: Item[]; // Array of all user's consumables
  privacySettings: {
    isLastWorkoutPublic: boolean;
    isCurrentQuestPublic: boolean;
  };
  createdAt: Date;
};
