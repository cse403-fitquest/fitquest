import { Item, ItemType } from '@/types/item';
import { SpriteID } from './sprite';

export const BASE_ITEM: Item = {
  id: '',
  type: ItemType.WEAPON,
  name: '',
  description: '',
  power: 0,
  speed: 0,
  health: 0,
  spriteID: SpriteID.T1_DAGGER,
  cost: 0,
  createdAt: new Date(),
};

const currentDate = new Date();

export const MOCK_ITEMS: Item[] = [
  // Tier 1 equipment
  {
    id: 't1_dagger',
    type: ItemType.WEAPON,
    name: 'T1 Dagger',
    description:
      "Small but mighty! Perfect for poking holes in your enemies' plans.",
    power: 5,
    speed: 10,
    health: 0,
    spriteID: SpriteID.T1_DAGGER,
    cost: 50,
    createdAt: currentDate,
  },
  {
    id: 't1_sword',
    type: ItemType.WEAPON,
    name: 'T1 Sword',
    description:
      'Simple but effective. Cuts down foes and keeps things classy.',
    power: 7,
    speed: 5,
    health: 0,
    spriteID: SpriteID.T1_SWORD,
    cost: 60,
    createdAt: currentDate,
  },
  {
    id: 't1_ring',
    type: ItemType.ACCESSORY,
    name: 'T1 Ring',
    description:
      'Simple, shiny, and just magical enough to make you feel special.',
    power: 1,
    speed: 0,
    health: 3,
    spriteID: SpriteID.T1_RING,
    cost: 30,
    createdAt: currentDate,
  },
  {
    id: 't1_helm',
    type: ItemType.ACCESSORY,
    name: 'T1 Helm',
    description:
      'Keeps your head safe and your dignity questionable. Better safe than sorry!',
    power: 0,
    speed: 0,
    health: 5,
    spriteID: SpriteID.T1_HELM,
    cost: 40,
    createdAt: currentDate,
  },
  {
    id: 't1_shield',
    type: ItemType.ACCESSORY,
    name: 'T1 Shield',
    description: 'Ideal for blocking unwanted blows... and conversations.',
    power: 2,
    speed: -1,
    health: 7,
    spriteID: SpriteID.T1_SHIELD,
    cost: 70,
    createdAt: currentDate,
  },

  {
    id: 't1_heavy_armor',
    type: ItemType.ARMOR,
    name: 'T1 Heavy Armor',
    description:
      'Clunky but dependable. Prepare for a slow, fashionable entrance.',
    power: 0,
    speed: -2,
    health: 10,
    spriteID: SpriteID.T1_HEAVY_ARMOR,
    cost: 100,
    createdAt: currentDate,
  },

  // Tier 2 equipment
  {
    id: 't2_dagger',
    type: ItemType.WEAPON,
    name: 'T2 Dagger',
    description:
      'Sharper, faster, and guaranteed to make you look like a sneaky pro.',
    power: 10,
    speed: 12,
    health: 0,
    spriteID: SpriteID.T2_DAGGER,
    cost: 80,
    createdAt: currentDate,
  },
  {
    id: 't2_heavy_armor',
    type: ItemType.ARMOR,
    name: 'T2 Heavy Armor',
    description:
      'For when you want to feel like a tank and look twice as intimidating.',
    power: 0,
    speed: -3,
    health: 15,
    spriteID: SpriteID.T2_HEAVY_ARMOR,
    cost: 150,
    createdAt: currentDate,
  },
  {
    id: 't2_sword',
    type: ItemType.WEAPON,
    name: 'T2 Sword',
    description:
      'Sharper, deadlier, and just classy enough to keep things civil.',
    power: 12,
    speed: 6,
    health: 0,
    spriteID: SpriteID.T2_SWORD,
    cost: 110,
    createdAt: currentDate,
  },

  // Tier 3 equipment
  {
    id: 't3_dagger',
    type: ItemType.WEAPON,
    name: 'T3 Dagger',
    description:
      'An assassin’s best friend. Sharp enough to cut through ego and armor alike.',
    power: 15,
    speed: 14,
    health: 0,
    spriteID: SpriteID.T3_DAGGER,
    cost: 120,
    createdAt: currentDate,
  },
  {
    id: 't3_sword',
    type: ItemType.WEAPON,
    name: 'T3 Sword',
    description:
      'A sword fit for a knight who means business. Warning: might make you feel noble.',
    power: 17,
    speed: 7,
    health: 0,
    spriteID: SpriteID.T3_SWORD,
    cost: 150,
    createdAt: currentDate,
  },
  {
    id: 't3_heavy_armor',
    type: ItemType.ARMOR,
    name: 'T3 Heavy Armor',
    description:
      'Sturdier than your average wall. You might as well be a fortress.',
    power: 0,
    speed: -4,
    health: 20,
    spriteID: SpriteID.T3_HEAVY_ARMOR,
    cost: 200,
    createdAt: currentDate,
  },

  // Tier 4 equipment
  {
    id: 't4_dagger',
    type: ItemType.WEAPON,
    name: 'T4 Dagger',
    description:
      'The pinnacle of poking potential. Goes in smooth, comes out victorious.',
    power: 20,
    speed: 16,
    health: 0,
    spriteID: SpriteID.T4_DAGGER,
    cost: 160,
    createdAt: currentDate,
  },
  {
    id: 't4_sword',
    type: ItemType.WEAPON,
    name: 'T4 Sword',
    description:
      'Legendary craftsmanship. Slices foes and bread with equal ease and grace.',
    power: 22,
    speed: 8,
    health: 0,
    spriteID: SpriteID.T4_SWORD,
    cost: 200,
    createdAt: currentDate,
  },
  {
    id: 't4_heavy_armor',
    type: ItemType.ARMOR,
    name: 'T4 Heavy Armor',
    description: 'An armor so tough, even dragons might have second thoughts.',
    power: 0,
    speed: -5,
    health: 25,
    spriteID: SpriteID.T4_HEAVY_ARMOR,
    cost: 250,
    createdAt: currentDate,
  },

  // Consumables
  {
    id: 'health_potion_small',
    type: ItemType.POTION_SMALL,
    name: 'Small Health Potion',
    description: 'Heals 10% of max health. A sip-sized fix for small troubles.',
    power: 0,
    speed: 0,
    health: 0,
    cost: 50,
    spriteID: SpriteID.HEALTH_POTION_SMALL,
    createdAt: currentDate,
  },
  {
    id: 'health_potion_medium',
    type: ItemType.POTION_MEDIUM,
    name: 'Medium Health Potion',
    description:
      'Heals 15% of max health. For those medium-level problems in life (and death).',
    power: 0,
    speed: 0,
    health: 0,
    cost: 75,
    spriteID: SpriteID.HEALTH_POTION_MEDIUM,
    createdAt: currentDate,
  },
  {
    id: 'health_potion_large',
    type: ItemType.POTION_LARGE,
    name: 'Large Health Potion',
    description: 'Heals 20% of max health. A full dose of "not today, death!"',
    power: 0,
    speed: 0,
    health: 0,
    cost: 100,
    spriteID: SpriteID.HEALTH_POTION_LARGE,
    createdAt: currentDate,
  },
];
