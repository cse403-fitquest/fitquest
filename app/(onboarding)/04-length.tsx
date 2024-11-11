import { Text, View } from 'react-native';
import { RadioGroup } from 'react-native-radio-buttons-group';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '@/store/onboarding';
import FQButton from '@/components/FQButton';
import { router } from 'expo-router';

const OnboardingLength = () => {
  const { length, setLength } = useOnboardingStore();

  const handleRadioChange = (data: string) => {
    const value = parseInt(data);

    if (value === 1 || value === 2 || value === 3 || value === 4) {
      setLength(value);
      return;
    }

    console.log('Invalid length value');
  };

  return (
    <SafeAreaView className="relative w-full h-full px-10 py-8 justify-center items-center">
      <View className="w-full">
        <Text className="text-3xl font-bold mb-10">
          On average, how long are each of your workout sessions?
        </Text>
        <View className="mb-10">
          <RadioGroup
            selectedId={length.toString()}
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
                label: '15-30 minutes',
                value: '0',
              },
              {
                id: '2',
                label: '30-60 minutes',
                value: '1',
              },
              {
                id: '3',
                label: '60-90 minutes',
                value: '2',
              },
              {
                id: '4',
                label: 'More than 90 minutes',
                value: '3',
              },
            ]}
            onPress={handleRadioChange}
          />
        </View>
        <FQButton
          onPress={() => router.replace('./05-intensity')}
          className="mb-5"
        >
          NEXT
        </FQButton>
        <FQButton onPress={() => router.replace('./03-frequency')} secondary>
          BACK
        </FQButton>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingLength;
