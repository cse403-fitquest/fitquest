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
    case SpriteID.T1_DAGGER:
      spriteSource = require('@/assets/sprites/t1_dagger512.png');
      break;
    case SpriteID.T1_SWORD:
      spriteSource = require('@/assets/sprites/t1_sword512.png');
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
    case SpriteID.T2_DAGGER:
      spriteSource = require('@/assets/sprites/t2_dagger512.png');
      break;
    case SpriteID.T2_SWORD:
      spriteSource = require('@/assets/sprites/t2_sword512.png');
      break;
    // case SpriteID.T2_HELM:
    //   spriteSource = require('@/assets/sprites/t2_helm.png');
    //   break;
    // case SpriteID.T2_SHIELD:
    //   spriteSource = require('@/assets/sprites/t2_shield.png');
    //   break;
    case SpriteID.T2_HEAVY_ARMOR:
      spriteSource = require('@/assets/sprites/t2_heavy_armor.png');
      break;

    case SpriteID.T3_DAGGER:
      spriteSource = require('@/assets/sprites/t3_dagger512.png');
      break;
    case SpriteID.T3_SWORD:
      spriteSource = require('@/assets/sprites/t3_sword512.png');
      break;

    case SpriteID.T4_DAGGER:
      spriteSource = require('@/assets/sprites/t4_dagger512.png');
      break;
    case SpriteID.T4_SWORD:
      spriteSource = require('@/assets/sprites/t4_sword512.png');
      break;

    // case SpriteID.SMALL_HEALTH_POTION:
    //   spriteSource = require('@/assets/sprites/small_health_potion.png');
    //   break;
    // case SpriteID.MEDIUM_HEALTH_POTION:
    //   spriteSource = require('@/assets/sprites/medium_health_potion.png');
    //   break;
    // case SpriteID.LARGE_HEALTH_POTION:
    //   spriteSource = require('@/assets/sprites/large_health_potion.png');
    //   break;
  }

  return (
    <Image
      source={spriteSource}
      style={{ width: width ?? 120, height: height ?? 120 }}
    />
  );
};
