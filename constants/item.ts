import { Item, ItemType } from '@/types/item';

export const BASE_ITEM: Item = {
  id: '',
  type: ItemType.WEAPON,
  name: '',
  description: '',
  power: 0,
  speed: 0,
  health: 0,
  spriteID: '',
  cost: 0,
  createdAt: new Date(),
};
