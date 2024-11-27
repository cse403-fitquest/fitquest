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
      spriteSource = require('@/assets/sprites/t1_dagger.png');
      break;
    case SpriteID.T1_SWORD:
      spriteSource = require('@/assets/sprites/t1_sword.png');
      break;
    case SpriteID.T1_RING:
      spriteSource = require('@/assets/sprites/t1_ring.png');
      break;
    case SpriteID.T1_HELM:
      spriteSource = require('@/assets/sprites/t1_helm.png');
      break;
    case SpriteID.T1_SHIELD:
      spriteSource = require('@/assets/sprites/t1_shield.png');
      break;
    case SpriteID.T1_HEAVY_ARMOR:
      spriteSource = require('@/assets/sprites/t1_heavy_armor.png');
      break;

    // Tier 2 equipment
    case SpriteID.T2_DAGGER:
      spriteSource = require('@/assets/sprites/t2_dagger.png');
      break;
    case SpriteID.T2_SWORD:
      spriteSource = require('@/assets/sprites/t2_sword.png');
      break;
    case SpriteID.T2_HEAVY_ARMOR:
      spriteSource = require('@/assets/sprites/t2_heavy_armor.png');
      break;

    // Tier 3 equipment
    case SpriteID.T3_DAGGER:
      spriteSource = require('@/assets/sprites/t3_dagger.png');
      break;
    case SpriteID.T3_SWORD:
      spriteSource = require('@/assets/sprites/t3_sword.png');
      break;
    case SpriteID.T3_HEAVY_ARMOR:
      spriteSource = require('@/assets/sprites/t3_heavy_armor.png');
      break;

    // Tier 4 equipment
    case SpriteID.T4_DAGGER:
      spriteSource = require('@/assets/sprites/t4_dagger.png');
      break;
    case SpriteID.T4_SWORD:
      spriteSource = require('@/assets/sprites/t4_sword.png');
      break;
    case SpriteID.T4_HEAVY_ARMOR:
      spriteSource = require('@/assets/sprites/t4_heavy_armor.png');
      break;

    case SpriteID.HEALTH_POTION_SMALL:
      spriteSource = require('@/assets/sprites/health_potion_small.png');
      break;
    case SpriteID.HEALTH_POTION_MEDIUM:
      spriteSource = require('@/assets/sprites/health_potion_medium.png');
      break;
    case SpriteID.HEALTH_POTION_LARGE:
      spriteSource = require('@/assets/sprites/health_potion_large.png');
      break;

    default:
      spriteSource = require('@/assets/sprites/t1_ring.png');
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
