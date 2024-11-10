import { Text, View } from 'react-native';
import { RadioGroup } from 'react-native-radio-buttons-group';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '@/store/onboarding';

import FQButton from '@/components/FQButton';
import { router } from 'expo-router';
// const { frequency, setFrequency } = useOnboardingStore();
// import { useOnboardingStore } from '../store/onboarding';

/* Onboarding Wizard
 * This component will be used to guide the user through a series of questions to set up their profile.
 * The user will be asked to select from a series of multiple choice options.
 * Each response contributes to a final score which determines the user's starting stats.
 */
const OnboardingFrequency = () => {
  const { frequency, setFrequency } = useOnboardingStore();

  const handleRadioChange = (data: string) => {
    const value = parseInt(data);

    if (value === 1 || value === 2 || value === 3 || value === 4) {
      setFrequency(value);
      return;
    }

    console.log('Invalid frequency value');
  };

  return (
    <SafeAreaView className="relative w-full h-full px-10 py-8 justify-center items-center">
      <View className="w-full">
        <Text className="text-3xl font-bold mb-10">
          How often do you engage in physical exercise each week?
        </Text>
        <View className="mb-10">
          <RadioGroup
            labelStyle={{
              fontSize: 18,
              marginBottom: 5,
            }}
            selectedId={frequency.toString()}
            radioButtons={[
              {
                id: '1',
                label: 'I am not currently exercising',
                value: '0',
              },
              {
                id: '2',
                label: '1-2 times per week',
                value: '1',
              },
              {
                id: '3',
                label: '3-4 times per week',
                value: '2',
              },
              {
                id: '4',
                label: '5+ times per week',
                value: '3',
              },
            ]}
            onPress={handleRadioChange}
          />
        </View>
        <FQButton
          onPress={() => router.replace('./04-length')}
          className="mb-5"
        >
          NEXT
        </FQButton>
        <FQButton onPress={() => router.replace('./02-before-begin')} secondary>
          BACK
        </FQButton>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingFrequency;
