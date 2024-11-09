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
      case AnimatedSpriteID.HERO_01:
        return require('@/assets/sprites/animated/heroes/hero_01.png');
      case AnimatedSpriteID.SLIME_GREEN:
        return require('@/assets/sprites/animated/monsters/slime_green.png');
      case AnimatedSpriteID.SLIME_BLUE:
        return require('@/assets/sprites/animated/monsters/slime_blue.png');
      case AnimatedSpriteID.SLIME_RED:
        return require('@/assets/sprites/animated/monsters/slime_red.png');
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
