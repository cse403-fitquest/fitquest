import { Text } from 'react-native';
import React from 'react';
import { RadioGroup } from 'react-native-radio-buttons-group';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '@/store/onboarding';
import FQButton from '@/components/FQButton';
// const { frequency, setFrequency } = useOnboardingStore();
// import { useOnboardingStore } from '../store/onboarding';

/* OnboardingIntensity Wizard
 * This component will be used to guide the user through a series of questions to set up their profile.
 * The user will be asked to select from a series of multiple choice options.
 * Each response contributes to a final score which determines the user's starting stats.
 */
const OnboardingIntensity = () => {
  const { step, setStep } = useOnboardingStore();

  return (
    <SafeAreaView className="relative w-full h-full px-10 py-8 justify-center items-center">
      <Text>
        Question 3: How would you describe the intensity of your typical
        workouts?
      </Text>
      <RadioGroup
        radioButtons={[
          {
            id: '1',
            label: 'Light (casual walking)',
            value: '0',
          },
          {
            id: '2',
            label: 'Moderate (easy jogging)',
            value: '1',
          },
          {
            id: '3',
            label: 'Vigorous (fast cycling)',
            value: '2',
          },
          {
            id: '4',
            label: 'Intense (heavy powerlifting)',
            value: '3',
          },
        ]}
        onPress={(data) => console.log(data)}
      />
      <FQButton onPress={() => setStep(step + 1)}>START MY JOURNEY</FQButton>
    </SafeAreaView>
  );
};

export default OnboardingIntensity;
