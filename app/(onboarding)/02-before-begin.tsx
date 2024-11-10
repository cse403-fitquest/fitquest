import { Text } from 'react-native';
import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '@/store/onboarding';

import FQButton from '@/components/FQButton';
// const { frequency, setFrequency } = useOnboardingStore();
// import { useOnboardingStore } from '../store/onboarding';

/* Onboarding Wizard
 * This component will be used to guide the user through a series of questions to set up their profile.
 * The user will be asked to select from a series of multiple choice options.
 * Each response contributes to a final score which determines the user's starting stats.
 */
const BeforeBegin = () => {
  const { step, setStep } = useOnboardingStore();

  return (
    <SafeAreaView className="relative w-full h-full px-10 py-8 justify-center items-center">
      <Text>Before we begin, let's determine your fitness level.</Text>

      <FQButton onPress={() => setStep(step + 1)}>START MY JOURNEY</FQButton>
    </SafeAreaView>
  );
};

export default BeforeBegin;
