import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FQButton from '@/components/FQButton';
import { router } from 'expo-router';
import { computeFitnessLevel } from '@/utils/onboarding';
import { useOnboardingStore } from '@/store/onboarding';
import { ONBOARDING_FITNESS_LEVEL_POINTS } from '@/constants/onboarding';

const BeforeBegin = () => {
  const {
    frequency,
    length,
    intensity,
    experience,
    setFitnessLevel,
    setCurrentPoints,
  } = useOnboardingStore();

  const handleGoToFitnessLevel = () => {
    const fl = computeFitnessLevel(frequency, length, intensity, experience);
    setFitnessLevel(fl);

    const pointsToAllocate = ONBOARDING_FITNESS_LEVEL_POINTS[fl];
    setCurrentPoints(pointsToAllocate);

    router.replace('./07-fitness-level');
  };

  return (
    <SafeAreaView className="relative w-full h-full px-12 py-8 justify-center items-center">
      <View className="w-full">
        <Text className="text-4xl font-bold mb-16">
          Before we begin, let's determine your fitness level...
        </Text>

        <FQButton
          onPress={() => router.replace('./03-frequency')}
          className="mb-5"
        >
          NEXT
        </FQButton>
        <View className="w-full items-center">
          <TouchableOpacity onPress={handleGoToFitnessLevel}>
            <Text className="text-lg font-black text-gray">
              OR SKIP THIS STEP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BeforeBegin;
