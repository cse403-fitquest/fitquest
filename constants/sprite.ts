export enum SpriteID {
  // Equipment
  T1_DAGGER = 't1_dagger',
  T1_SWORD = 't1_sword',
  T1_HELM = 't1_helm',
  T1_SHIELD = 't1_shield',
  T1_HEAVY_ARMOR = 't1_heavy_armor',

  T2_DAGGER = 't2_dagger',
  T2_SWORD = 't2_sword',
  //   T2_HELM = 't2_helm',
  //   T2_SHIELD = 't2_shield',
  T2_HEAVY_ARMOR = 't2_heavy_armor',

  //  Consumables
  //   SMALL_HEALTH_POTION = 'small_health_potion',
  //   MEDIUM_HEALTH_POTION = 'medium_health_potion',
  //   LARGE_HEALTH_POTION = 'large_health_potion',
}

export enum SpriteState {
  IDLE = 'idle',
  WALK = 'walk',
  ATTACK_1 = 'attack_1',
  ATTACK_2 = 'attack_2',
  ATTACK_3 = 'attack_3',
  DAMAGED = 'damaged',
  DEATH = 'death',
}

export enum AnimatedSpriteID {
  // Heros
  HERO_01 = 'hero_01',

  // Monsters
  SLIME_GREEN = 'slime_green',
  SLIME_BLUE = 'slime_blue',
  SLIME_RED = 'slime_red',

  // Bosses
  MINOTAUR_RED = 'minotaur_red',
  MINOTAUR_BLACK = 'minotaur_black',
}
