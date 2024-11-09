import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { FC, useEffect, useMemo, useRef } from 'react';
import { Animated, View } from 'react-native';
import { Easing } from 'react-native-reanimated';

interface IAnimatedSprite {
  id: AnimatedSpriteID;
  state: SpriteState;
  width?: number;
  height?: number;
  className?: string;
}

export const AnimatedSprite: FC<IAnimatedSprite> = ({
  id,
  width,
  height,
  className,
}) => {
  const frameWidth = width ?? 96; // Width of each frame
  const frameHeight = height ?? 96; // Height of each frame
  const totalFrames = 6; // Total number of frames (varies for each entity)
  const animationDuration = 1000; // Total animation duration in ms

  const animatedValue = useRef(new Animated.Value(0)).current;

  const spriteSource = useMemo(() => {
    switch (id) {
      // Heroes
      case AnimatedSpriteID.HERO_01:
        return require('@/assets/sprites/animated/heroes/hero_01.png');
      case AnimatedSpriteID.HERO_02:
        return require('@/assets/sprites/animated/heroes/hero_02.png');
      case AnimatedSpriteID.HERO_03:
        return require('@/assets/sprites/animated/heroes/hero_03.png');
      case AnimatedSpriteID.HERO_04:
        return require('@/assets/sprites/animated/heroes/hero_04.png');
      case AnimatedSpriteID.HERO_05:
        return require('@/assets/sprites/animated/heroes/hero_05.png');
      case AnimatedSpriteID.HERO_06:
        return require('@/assets/sprites/animated/heroes/hero_06.png');
      case AnimatedSpriteID.HERO_07:
        return require('@/assets/sprites/animated/heroes/hero_07.png');
      case AnimatedSpriteID.HERO_08:
        return require('@/assets/sprites/animated/heroes/hero_08.png');
      case AnimatedSpriteID.HERO_09:
        return require('@/assets/sprites/animated/heroes/hero_09.png');
      case AnimatedSpriteID.HERO_10:
        return require('@/assets/sprites/animated/heroes/hero_10.png');
      case AnimatedSpriteID.HERO_11:
        return require('@/assets/sprites/animated/heroes/hero_11.png');
      case AnimatedSpriteID.HERO_12:
        return require('@/assets/sprites/animated/heroes/hero_12.png');
      case AnimatedSpriteID.HERO_13:
        return require('@/assets/sprites/animated/heroes/hero_13.png');
      case AnimatedSpriteID.HERO_14:
        return require('@/assets/sprites/animated/heroes/hero_14.png');
      case AnimatedSpriteID.HERO_15:
        return require('@/assets/sprites/animated/heroes/hero_15.png');
      case AnimatedSpriteID.HERO_16:
        return require('@/assets/sprites/animated/heroes/hero_16.png');
      case AnimatedSpriteID.HERO_17:
        return require('@/assets/sprites/animated/heroes/hero_17.png');
      case AnimatedSpriteID.HERO_18:
        return require('@/assets/sprites/animated/heroes/hero_18.png');
      case AnimatedSpriteID.HERO_19:
        return require('@/assets/sprites/animated/heroes/hero_19.png');
      case AnimatedSpriteID.HERO_20:
        return require('@/assets/sprites/animated/heroes/hero_20.png');
      case AnimatedSpriteID.HERO_21:
        return require('@/assets/sprites/animated/heroes/hero_21.png');
      case AnimatedSpriteID.HERO_22:
        return require('@/assets/sprites/animated/heroes/hero_22.png');
      case AnimatedSpriteID.HERO_23:
        return require('@/assets/sprites/animated/heroes/hero_23.png');
      case AnimatedSpriteID.HERO_24:
        return require('@/assets/sprites/animated/heroes/hero_24.png');
      case AnimatedSpriteID.HERO_25:
        return require('@/assets/sprites/animated/heroes/hero_25.png');
      case AnimatedSpriteID.HERO_26:
        return require('@/assets/sprites/animated/heroes/hero_26.png');
      case AnimatedSpriteID.HERO_27:
        return require('@/assets/sprites/animated/heroes/hero_27.png');
      case AnimatedSpriteID.HERO_28:
        return require('@/assets/sprites/animated/heroes/hero_28.png');
      case AnimatedSpriteID.HERO_29:
        return require('@/assets/sprites/animated/heroes/hero_29.png');
      case AnimatedSpriteID.HERO_30:
        return require('@/assets/sprites/animated/heroes/hero_30.png');

      // Monsters
      case AnimatedSpriteID.SLIME_GREEN:
        return require('@/assets/sprites/animated/monsters/slime_green.png');
      case AnimatedSpriteID.SLIME_BLUE:
        return require('@/assets/sprites/animated/monsters/slime_blue.png');
      case AnimatedSpriteID.SLIME_RED:
        return require('@/assets/sprites/animated/monsters/slime_red.png');

      // Bosses
      case AnimatedSpriteID.MINOTAUR_RED:
        return require('@/assets/sprites/animated/bosses/minotaur_red.png');
      case AnimatedSpriteID.MINOTAUR_BLACK:
        return require('@/assets/sprites/animated/bosses/minotaur_black.png');
      default:
        return require('@/assets/sprites/animated/heroes/hero_01.png');
    }
  }, [id]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: -frameWidth * (totalFrames - 1), // Move to the last frame
        duration: animationDuration,
        easing: Easing.steps(totalFrames - 1), // Move up to the last frame
        useNativeDriver: true,
      }),
    ).start();
  }, [animatedValue]);

  return (
    <View
      style={{
        width: frameWidth,
        height: frameHeight,
      }}
      className={`top-0 left-0 overflow-hidden ${className}`}
    >
      <Animated.Image
        source={spriteSource}
        style={[
          {
            top: 0,
            left: 0,
            width: frameWidth * totalFrames, // Total width of the sprite sheet
            height: frameHeight * 12,
            transform: [{ translateX: animatedValue }],
          },
        ]}
      />
    </View>
  );
};
