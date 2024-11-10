import { Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTitle from '@/components/AppTitle';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import FQButton from '@/components/FQButton';
import { router } from 'expo-router';
// const { frequency, setFrequency } = useOnboardingStore();
// import { useOnboardingStore } from '../store/onboarding';

/*
 * Onboarding Wizard
 * This route will be used to guide the user through a series of questions to set up their profile.
 * The user will be asked to select from a series of multiple choice options.
 * Each response contributes to a final score which determines the user's starting stats.
 */
const Welcome = () => {
  return (
    <SafeAreaView className="relative w-full h-full px-10 py-8 justify-center items-center">
      <View className="w-full">
        <Text className="text-2xl font-bold">Welcome to</Text>
        <AppTitle />
        <View className="mb-12 flex-row w-full justify-center">
          <View>
            <AnimatedSprite
              id={AnimatedSpriteID.HERO_14}
              state={SpriteState.WALK}
              width={115}
              height={115}
            />
          </View>
          <View>
            <AnimatedSprite
              id={AnimatedSpriteID.HERO_16}
              state={SpriteState.IDLE}
              width={115}
              height={115}
            />
          </View>
          <View>
            <AnimatedSprite
              id={AnimatedSpriteID.HERO_19}
              state={SpriteState.IDLE}
              width={115}
              height={115}
            />
          </View>
        </View>
        <View className="w-full items-center">
          <Text className="font-black mb-10">
            YOUR PERSONAL FITNESS ADVENTURE
          </Text>
        </View>

        <FQButton
          onPress={() => {
            router.replace('./02-before-begin');
          }}
        >
          START MY JOURNEY
        </FQButton>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
