import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '@/store/onboarding';
import FQButton from '@/components/FQButton';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { computeFitnessLevel } from '@/utils/onboarding';
import { FitnessLevel } from '@/types/onboarding';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';

const OnboardingFitnessLevel = () => {
  const { frequency, length, intensity, experience } = useOnboardingStore();

  // Calculate the user's fitness level based on their answers to the onboarding questions
  const fitnessLevelDisplay = useMemo(() => {
    const fl = computeFitnessLevel(frequency, length, intensity, experience);

    switch (fl) {
      case FitnessLevel.BEGINNER:
        return 'BEGINNER';
      case FitnessLevel.NOVICE:
        return 'NOVICE';
      case FitnessLevel.INTERMEDIATE:
        return 'INTERMEDIATE';
      case FitnessLevel.ADVANCED:
        return 'ADVANCED';
      default:
        return 'BEGINNER';
    }
  }, [frequency, length, intensity, experience]);

  return (
    <SafeAreaView className="relative w-full h-full px-10 py-8 justify-center items-center">
      <View className="w-full">
        <View className="w-full items-center">
          <Text className="mb-2 text-md font-medium">
            You're estimated fitness level is
          </Text>
          <Text className="text-4xl font-bold">{fitnessLevelDisplay}</Text>
        </View>

        <View className="items-center justify-center h-[160px] overflow-hidden mb-10">
          <View className="absolute bottom-0 flex-row justify-center items-end">
            <View className="relative left-[25px]">
              <AnimatedSprite
                id={AnimatedSpriteID.HERO_25}
                state={SpriteState.ATTACK_1}
                width={120}
                height={120}
                duration={600}
              />
            </View>
            <View className="relative right-[25px]">
              <AnimatedSprite
                id={AnimatedSpriteID.FIRE_SKULL_RED}
                state={SpriteState.DAMAGED}
                direction="left"
                width={150}
                height={150}
                duration={600}
                delay={200}
              />
            </View>
          </View>
        </View>

        <FQButton
          onPress={() => router.replace('./08-allocate-points')}
          className="mb-5"
        >
          ALLOCATE POINTS
        </FQButton>
        <View className="w-full items-center">
          <TouchableOpacity onPress={() => router.replace('./03-frequency')}>
            <Text className="text-lg font-black text-gray">
              OR REDO THE SURVEY
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingFitnessLevel;
