import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { isBossSprite, isHeroSprite, isMonsterSprite } from '@/utils/sprite';
import { FC, useEffect, useMemo, useRef } from 'react';
import { Animated, View } from 'react-native';
import { Easing } from 'react-native-reanimated';

interface IAnimatedSprite {
  id: AnimatedSpriteID | undefined;
  state: SpriteState;
  width?: number;
  height?: number;
  duration?: number;
  direction?: 'left' | 'right';
  delay?: number;
  className?: string;
}

export const AnimatedSprite: FC<IAnimatedSprite> = ({
  id = AnimatedSpriteID.HERO_01,
  state = SpriteState.IDLE,
  width = 96,
  height = 96,
  duration = 1000,
  direction = 'right',
  delay = 0,
  className,
}) => {
  const frameWidth = width; // Width of each frame
  const frameHeight = height; // Height of each frame
  const animationDuration = duration; // Total animation duration in ms

  const totalFramesHorizontal = useMemo(() => {
    if (isHeroSprite(id)) {
      return 6;
    } else if (isMonsterSprite(id)) {
      return 6;
    } else if (isBossSprite(id)) {
      return 6;
    } else {
      // Handle non uniform sprite sheets
      return 6;
    }
  }, [id]);
  const totalFramesVertical = useMemo(() => {
    if (isHeroSprite(id)) {
      return 12;
    } else if (isMonsterSprite(id)) {
      return 5;
    } else if (isBossSprite(id)) {
      return 6;
    } else {
      // Handle non uniform sprite sheets
      return 6;
    }
  }, [id]);

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
      case AnimatedSpriteID.FIRE_SKULL_RED:
        return require('@/assets/sprites/animated/monsters/fire_skull_red.png');
      case AnimatedSpriteID.FIRE_SKULL_BLUE:
        return require('@/assets/sprites/animated/monsters/fire_skull_blue.png');
      case AnimatedSpriteID.FIRE_SKULL_GREEN:
        return require('@/assets/sprites/animated/monsters/fire_skull_green.png');
      case AnimatedSpriteID.FIRE_SKULL_CRMISON:
        return require('@/assets/sprites/animated/monsters/fire_skull_crimson.png');
      case AnimatedSpriteID.CAT_BROWN:
        return require('@/assets/sprites/animated/monsters/cat_brown.png');
      case AnimatedSpriteID.CAT_GREEN:
        return require('@/assets/sprites/animated/monsters/cat_green.png');
      case AnimatedSpriteID.CAT_MOSS:
        return require('@/assets/sprites/animated/monsters/cat_moss.png');
      case AnimatedSpriteID.CAT_RED:
        return require('@/assets/sprites/animated/monsters/cat_red.png');

      // Bosses
      case AnimatedSpriteID.MINOTAUR_RED:
        return require('@/assets/sprites/animated/bosses/minotaur_red.png');
      case AnimatedSpriteID.MINOTAUR_BLACK:
        return require('@/assets/sprites/animated/bosses/minotaur_black.png');
      case AnimatedSpriteID.CHOMPBUG_GREEN:
        return require('@/assets/sprites/animated/bosses/chompbug_green.png');
      case AnimatedSpriteID.CHOMPBUG_RED:
        return require('@/assets/sprites/animated/bosses/chompbug_red.png');
      case AnimatedSpriteID.CHOMPBUG_BLACK:
        return require('@/assets/sprites/animated/bosses/chompbug_black.png');

      default:
        return require('@/assets/sprites/animated/heroes/hero_01.png');
    }
  }, [id]);

  // Calculate the frame index based on the sprite state
  const stateFrameIndex = useMemo(() => {
    if (state === SpriteState.IDLE) {
      return 0;
    } else if (state === SpriteState.MOVE) {
      return 1;
    }

    // Each sprite sheet has a different number of frames for each state
    if (isHeroSprite(id)) {
      switch (state) {
        case SpriteState.ATTACK_1:
          return 2;
        case SpriteState.ATTACK_2:
          return 3;
        case SpriteState.ATTACK_3:
          return 4;
        case SpriteState.ATTACK_4:
          return 5;
        case SpriteState.DAMAGED:
          return 8;
        case SpriteState.DEATH:
          return 9;
        default:
          return 0;
      }
    } else if (isMonsterSprite(id)) {
      switch (state) {
        case SpriteState.ATTACK_1:
          return 2;
        case SpriteState.DAMAGED:
          return 3;
        case SpriteState.DEATH:
          return 4;
        default:
          return 0;
      }
    } else if (isBossSprite(id)) {
      switch (state) {
        case SpriteState.ATTACK_1:
          return 2;
        case SpriteState.ATTACK_2:
          return 3;
        case SpriteState.DAMAGED:
          return 4;
        case SpriteState.DEATH:
          return 5;
        default:
          return 0;
      }
    }

    return 0;
  }, [id, state]);

  useEffect(() => {
    const loopAnimation = () =>
      Animated.timing(animatedValue, {
        toValue: -frameWidth * (totalFramesHorizontal - 1), // Move to the last frame
        duration: animationDuration,
        delay: duration / totalFramesHorizontal,
        easing: Easing.steps(totalFramesHorizontal - 1), // Move up to the last frame
        useNativeDriver: true,
      }).start(() => {
        animatedValue.setValue(0); // Reset value after animation completes
        loopAnimation(); // Start the animation again
      });

    setTimeout(() => {
      loopAnimation();
    }, delay);

    return () => {
      animatedValue.stopAnimation();
    };
  }, [animatedValue, frameWidth, totalFramesHorizontal, animationDuration]);

  return (
    <View
      style={{
        width: frameWidth,
        height: frameHeight,
        overflow: 'hidden',
        transform: [
          {
            scaleX: direction === 'left' ? -1 : 1,
          },
        ],
      }}
      className={`relative top-0 ${className}`}
    >
      <Animated.Image
        source={spriteSource}
        style={[
          {
            position: 'absolute',
            top: -1,
            left: direction === 'right' ? 0 : undefined,
            right:
              direction === 'left'
                ? -frameWidth * totalFramesHorizontal + frameWidth
                : undefined,
            width: frameWidth * totalFramesHorizontal, // Total width of the sprite sheet
            height: frameHeight * totalFramesVertical, // Total height of the sprite sheet
            transform: [
              { translateX: animatedValue },
              {
                translateY: -frameHeight * stateFrameIndex,
              },
            ],
          },
        ]}
      />
    </View>
  );
};
