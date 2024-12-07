import { AnimatedSpriteID } from '@/constants/sprite';

export const isHeroSprite: (id: AnimatedSpriteID) => boolean = (id) => {
  switch (id) {
    case AnimatedSpriteID.HERO_01:
    case AnimatedSpriteID.HERO_02:
    case AnimatedSpriteID.HERO_03:
    case AnimatedSpriteID.HERO_04:
    case AnimatedSpriteID.HERO_05:
    case AnimatedSpriteID.HERO_06:
    case AnimatedSpriteID.HERO_07:
    case AnimatedSpriteID.HERO_08:
    case AnimatedSpriteID.HERO_09:
    case AnimatedSpriteID.HERO_10:
    case AnimatedSpriteID.HERO_11:
    case AnimatedSpriteID.HERO_12:
    case AnimatedSpriteID.HERO_13:
    case AnimatedSpriteID.HERO_14:
    case AnimatedSpriteID.HERO_15:
    case AnimatedSpriteID.HERO_16:
    case AnimatedSpriteID.HERO_17:
    case AnimatedSpriteID.HERO_18:
    case AnimatedSpriteID.HERO_19:
    case AnimatedSpriteID.HERO_20:
    case AnimatedSpriteID.HERO_21:
    case AnimatedSpriteID.HERO_22:
    case AnimatedSpriteID.HERO_23:
    case AnimatedSpriteID.HERO_24:
    case AnimatedSpriteID.HERO_25:
    case AnimatedSpriteID.HERO_26:
    case AnimatedSpriteID.HERO_27:
    case AnimatedSpriteID.HERO_28:
    case AnimatedSpriteID.HERO_29:
    case AnimatedSpriteID.HERO_30:
      return true;
    default:
      return false;
  }
};

export const isMonsterSprite: (id: AnimatedSpriteID) => boolean = (id) => {
  switch (id) {
    case AnimatedSpriteID.SLIME_BLUE:
    case AnimatedSpriteID.SLIME_GREEN:
    case AnimatedSpriteID.SLIME_RED:
    case AnimatedSpriteID.FIRE_SKULL_BLUE:
    case AnimatedSpriteID.FIRE_SKULL_GREEN:
    case AnimatedSpriteID.FIRE_SKULL_RED:
    case AnimatedSpriteID.FIRE_SKULL_CRMISON:
    case AnimatedSpriteID.CAT_BROWN:
    case AnimatedSpriteID.CAT_GREEN:
    case AnimatedSpriteID.CAT_MOSS:
    case AnimatedSpriteID.CAT_RED:
      return true;
    default:
      return false;
  }
};

export const isBossSprite: (id: AnimatedSpriteID) => boolean = (id) => {
  switch (id) {
    case AnimatedSpriteID.MINOTAUR_RED:
    case AnimatedSpriteID.MINOTAUR_BLACK:
    case AnimatedSpriteID.CHOMPBUG_GREEN:
    case AnimatedSpriteID.CHOMPBUG_RED:
    case AnimatedSpriteID.CHOMPBUG_BLACK:
    case AnimatedSpriteID.WEREWOLF_BROWN:
      return true;
    default:
      return false;
  }
};
