import { Text, View } from 'react-native';
import { RadioGroup } from 'react-native-radio-buttons-group';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '@/store/onboarding';
import FQButton from '@/components/FQButton';
import { router } from 'expo-router';

const OnboardingIntensity = () => {
  const { intensity, setIntensity } = useOnboardingStore();

  const handleRadioChange = (data: string) => {
    const value = parseInt(data);

    if (value === 1 || value === 2 || value === 3 || value === 4) {
      setIntensity(value);
      return;
    }

    console.log('Invalid intensity value');
  };

  return (
    <SafeAreaView className="relative w-full h-full px-10 py-8 justify-center items-center">
      <View className="w-full">
        <Text className="text-3xl font-bold mb-10">
          How would you describe the intensity of your typical workouts?
        </Text>
        <View className="mb-10">
          <RadioGroup
            selectedId={intensity.toString()}
            labelStyle={{
              fontSize: 18,
              marginBottom: 5,
            }}
            containerStyle={{
              alignItems: 'flex-start',
            }}
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
            onPress={handleRadioChange}
          />
        </View>
        <FQButton
          onPress={() => router.replace('./06-experience')}
          className="mb-5"
        >
          NEXT
        </FQButton>
        <FQButton onPress={() => router.replace('./04-length')} secondary>
          BACK
        </FQButton>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingIntensity;
