import { View, Text, SafeAreaView } from 'react-native';
import FQButton from '@/components/FQButton';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { router } from 'expo-router';

const OnboardingChooseAvatar = () => {
  const handleStartJourney = () => {};

  return (
    <SafeAreaView className="relative w-full h-full px-10 py-8 justify-center items-center">
      <View className="w-full">
        <View className="w-full items-center">
          <Text className="text-3xl font-bold">
            Almost set! Let's choose your avatar.
          </Text>
        </View>

        <View className="items-center justify-center h-[160px] overflow-hidden mb-10">
          <View className="absolute bottom-0 flex-row justify-center items-end">
            <AnimatedSprite
              id={AnimatedSpriteID.HERO_25}
              state={SpriteState.IDLE}
              width={200}
              height={200}
              duration={1500}
            />
          </View>
        </View>

        <FQButton onPress={handleStartJourney} className="mb-5">
          START YOUR JOURNEY
        </FQButton>
        <FQButton
          onPress={() => router.replace('./08-allocate-points')}
          secondary
        >
          BACK
        </FQButton>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingChooseAvatar;
