import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FQButton from '@/components/FQButton';
import { router } from 'expo-router';
import { useOnboardingStore } from '@/store/onboarding';
import { ONBOARDING_FITNESS_LEVEL_POINTS } from '@/constants/onboarding';
import { FitnessLevel } from '@/types/onboarding';

const BeforeBegin = () => {
  const { setFitnessLevel, setCurrentPoints } = useOnboardingStore();

  // Skip the fitness level calculation
  const handleGoToFitnessLevel = () => {
    // If skipping, set the fitness level to beginner
    const fl = FitnessLevel.BEGINNER;
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
