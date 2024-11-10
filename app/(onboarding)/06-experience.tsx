import { Text, View } from 'react-native';
import { RadioGroup } from 'react-native-radio-buttons-group';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '@/store/onboarding';
import FQButton from '@/components/FQButton';
import { router } from 'expo-router';

const OnboardingExperience = () => {
  const { experience, setExperience } = useOnboardingStore();

  const handleRadioChange = (data: string) => {
    const value = parseInt(data);

    if (value === 1 || value === 2 || value === 3 || value === 4) {
      setExperience(value);
      return;
    }

    console.log('Invalid experience value');
  };

  return (
    <SafeAreaView className="relative w-full h-full px-10 py-8 justify-center items-center">
      <View className="w-full">
        <Text className="text-3xl font-bold mb-10">
          How long have you been regularly exercising?
        </Text>
        <View className="mb-10">
          <RadioGroup
            selectedId={experience.toString()}
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
                label: "I'm just starting out",
                value: '0',
              },
              {
                id: '2',
                label: 'Less than a year',
                value: '1',
              },
              {
                id: '3',
                label: '1-3 years',
                value: '2',
              },
              {
                id: '4',
                label: 'Over 3 years',
                value: '3',
              },
            ]}
            onPress={handleRadioChange}
          />
        </View>
        <FQButton
          onPress={() => router.replace('./07-fitness-level')}
          className="mb-5"
        >
          NEXT
        </FQButton>
        <FQButton onPress={() => router.replace('./05-intensity')} secondary>
          BACK
        </FQButton>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingExperience;
