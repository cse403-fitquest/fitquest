import { SpriteID } from '@/constants/sprite';
import { FC } from 'react';
import { Image } from 'react-native';

interface ISprite {
  id: SpriteID;
  width?: number;
  height?: number;
}

export const Sprite: FC<ISprite> = ({ id, width, height }) => {
  let spriteSource = require('@/assets/sprites/t1_dagger.png');

  switch (id) {
    // Tier 1 equipment
    case SpriteID.T1_DAGGER:
      spriteSource = require('@/assets/sprites/t1_dagger512.png');
      break;
    case SpriteID.T1_SWORD:
      spriteSource = require('@/assets/sprites/t1_sword512.png');
      break;
    case SpriteID.T1_RING:
      spriteSource = require('@/assets/sprites/t1_ring512.png');
      break;
    case SpriteID.T1_HELM:
      spriteSource = require('@/assets/sprites/t1_helm512.png');
      break;
    case SpriteID.T1_SHIELD:
      spriteSource = require('@/assets/sprites/t1_shield512.png');
      break;
    case SpriteID.T1_HEAVY_ARMOR:
      spriteSource = require('@/assets/sprites/t1_heavy_armor512.png');
      break;

    // Tier 2 equipment
    case SpriteID.T2_DAGGER:
      spriteSource = require('@/assets/sprites/t2_dagger512.png');
      break;
    case SpriteID.T2_SWORD:
      spriteSource = require('@/assets/sprites/t2_sword512.png');
      break;
    case SpriteID.T2_HEAVY_ARMOR:
      spriteSource = require('@/assets/sprites/t2_heavy_armor512.png');
      break;

    // Tier 3 equipment
    case SpriteID.T3_DAGGER:
      spriteSource = require('@/assets/sprites/t3_dagger512.png');
      break;
    case SpriteID.T3_SWORD:
      spriteSource = require('@/assets/sprites/t3_sword512.png');
      break;
    case SpriteID.T3_HEAVY_ARMOR:
      spriteSource = require('@/assets/sprites/t3_heavy_armor512.png');
      break;

    // Tier 4 equipment
    case SpriteID.T4_DAGGER:
      spriteSource = require('@/assets/sprites/t4_dagger512.png');
      break;
    case SpriteID.T4_SWORD:
      spriteSource = require('@/assets/sprites/t4_sword512.png');
      break;
    case SpriteID.T4_HEAVY_ARMOR:
      spriteSource = require('@/assets/sprites/t4_heavy_armor512.png');
      break;

    case SpriteID.HEALTH_POTION_SMALL:
      spriteSource = require('@/assets/sprites/t1_hp_potion512.png');
      break;
    case SpriteID.HEALTH_POTION_MEDIUM:
      spriteSource = require('@/assets/sprites/t2_hp_potion512.png');
      break;
    case SpriteID.HEALTH_POTION_LARGE:
      spriteSource = require('@/assets/sprites/t3_hp_potion512.png');
      break;

    default:
      spriteSource = require('@/assets/sprites/t1_shield.png');
      break;
  }

  return (
    <Image
      testID="Sprite"
      source={spriteSource}
      style={{ width: width ?? 120, height: height ?? 120 }}
    />
  );
};
