export enum ItemType {
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
  ACCESSORY = 'ACCESSORY',
  POTION_SMALL = 'POTION_SMALL',
  POTION_MEDIUM = 'POTION_MEDIUM',
  POTION_LARGE = 'POTION_LARGE',
}

export type Item = {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  power: number;
  speed: number;
  health: number;
  spriteID: string;
  cost: number;
  createdAt: Date;
};
