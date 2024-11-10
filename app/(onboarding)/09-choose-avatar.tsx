import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import FQButton from '@/components/FQButton';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { router } from 'expo-router';
import { useOnboardingStore } from '@/store/onboarding';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const OnboardingChooseAvatar = () => {
  const { spriteID, setSpriteID } = useOnboardingStore();

  const [currentSpriteID, setCurrentSpriteID] = useState<number>(1);

  useEffect(() => {
    switch (spriteID) {
      case AnimatedSpriteID.HERO_01:
        setCurrentSpriteID(1);
        break;
      case AnimatedSpriteID.HERO_02:
        setCurrentSpriteID(2);
        break;
      case AnimatedSpriteID.HERO_03:
        setCurrentSpriteID(3);
        break;
      case AnimatedSpriteID.HERO_04:
        setCurrentSpriteID(4);
        break;
      case AnimatedSpriteID.HERO_05:
        setCurrentSpriteID(5);
        break;
      case AnimatedSpriteID.HERO_06:
        setCurrentSpriteID(6);
        break;
      case AnimatedSpriteID.HERO_07:
        setCurrentSpriteID(7);
        break;
      case AnimatedSpriteID.HERO_08:
        setCurrentSpriteID(8);
        break;
      case AnimatedSpriteID.HERO_09:
        setCurrentSpriteID(9);
        break;
      case AnimatedSpriteID.HERO_10:
        setCurrentSpriteID(10);
        break;
      case AnimatedSpriteID.HERO_11:
        setCurrentSpriteID(11);
        break;
      case AnimatedSpriteID.HERO_12:
        setCurrentSpriteID(12);
        break;
      case AnimatedSpriteID.HERO_13:
        setCurrentSpriteID(13);
        break;
      case AnimatedSpriteID.HERO_14:
        setCurrentSpriteID(14);
        break;
      case AnimatedSpriteID.HERO_15:
        setCurrentSpriteID(15);
        break;
      case AnimatedSpriteID.HERO_16:
        setCurrentSpriteID(16);
        break;
      case AnimatedSpriteID.HERO_17:
        setCurrentSpriteID(17);
        break;
      case AnimatedSpriteID.HERO_18:
        setCurrentSpriteID(18);
        break;
      case AnimatedSpriteID.HERO_19:
        setCurrentSpriteID(19);
        break;
      case AnimatedSpriteID.HERO_20:
        setCurrentSpriteID(20);
        break;
      case AnimatedSpriteID.HERO_21:
        setCurrentSpriteID(21);
        break;
      case AnimatedSpriteID.HERO_22:
        setCurrentSpriteID(22);
        break;
      case AnimatedSpriteID.HERO_23:
        setCurrentSpriteID(23);
        break;
      case AnimatedSpriteID.HERO_24:
        setCurrentSpriteID(24);
        break;
      case AnimatedSpriteID.HERO_25:
        setCurrentSpriteID(25);
        break;
      case AnimatedSpriteID.HERO_26:
        setCurrentSpriteID(26);
        break;
      case AnimatedSpriteID.HERO_27:
        setCurrentSpriteID(27);
        break;
      case AnimatedSpriteID.HERO_28:
        setCurrentSpriteID(28);
        break;
      case AnimatedSpriteID.HERO_29:
        setCurrentSpriteID(29);
        break;
      case AnimatedSpriteID.HERO_30:
        setCurrentSpriteID(30);
        break;
      default:
        setCurrentSpriteID(1);
        break;
    }
  }, []);

  useEffect(() => {
    switch (currentSpriteID) {
      case 1:
        setSpriteID(AnimatedSpriteID.HERO_01);
        break;
      case 2:
        setSpriteID(AnimatedSpriteID.HERO_02);
        break;
      case 3:
        setSpriteID(AnimatedSpriteID.HERO_03);
        break;
      case 4:
        setSpriteID(AnimatedSpriteID.HERO_04);
        break;
      case 5:
        setSpriteID(AnimatedSpriteID.HERO_05);
        break;
      case 6:
        setSpriteID(AnimatedSpriteID.HERO_06);
        break;
      case 7:
        setSpriteID(AnimatedSpriteID.HERO_07);
        break;
      case 8:
        setSpriteID(AnimatedSpriteID.HERO_08);
        break;
      case 9:
        setSpriteID(AnimatedSpriteID.HERO_09);
        break;
      case 10:
        setSpriteID(AnimatedSpriteID.HERO_10);
        break;
      case 11:
        setSpriteID(AnimatedSpriteID.HERO_11);
        break;
      case 12:
        setSpriteID(AnimatedSpriteID.HERO_12);
        break;
      case 13:
        setSpriteID(AnimatedSpriteID.HERO_13);
        break;
      case 14:
        setSpriteID(AnimatedSpriteID.HERO_14);
        break;
      case 15:
        setSpriteID(AnimatedSpriteID.HERO_15);
        break;
      case 16:
        setSpriteID(AnimatedSpriteID.HERO_16);
        break;
      case 17:
        setSpriteID(AnimatedSpriteID.HERO_17);
        break;
      case 18:
        setSpriteID(AnimatedSpriteID.HERO_18);
        break;
      case 19:
        setSpriteID(AnimatedSpriteID.HERO_19);
        break;
      case 20:
        setSpriteID(AnimatedSpriteID.HERO_20);
        break;
      case 21:
        setSpriteID(AnimatedSpriteID.HERO_21);
        break;
      case 22:
        setSpriteID(AnimatedSpriteID.HERO_22);
        break;
      case 23:
        setSpriteID(AnimatedSpriteID.HERO_23);
        break;
      case 24:
        setSpriteID(AnimatedSpriteID.HERO_24);
        break;
      case 25:
        setSpriteID(AnimatedSpriteID.HERO_25);
        break;
      case 26:
        setSpriteID(AnimatedSpriteID.HERO_26);
        break;
      case 27:
        setSpriteID(AnimatedSpriteID.HERO_27);
        break;
      case 28:
        setSpriteID(AnimatedSpriteID.HERO_28);
        break;
      case 29:
        setSpriteID(AnimatedSpriteID.HERO_29);
        break;
      case 30:
        setSpriteID(AnimatedSpriteID.HERO_30);
        break;
      default:
        setSpriteID(AnimatedSpriteID.HERO_01);
        break;
    }
  }, [currentSpriteID]);

  const handleStartJourney = () => {};

  return (
    <SafeAreaView className="relative w-full h-full px-10 py-8 justify-center items-center">
      <View className="w-full">
        <View className="w-full items-center mb-16">
          <Text className="text-3xl font-bold">
            Almost set! Let's choose your avatar.
          </Text>
        </View>

        <View className="relative w-full flex-row justify-between items-center mb-5">
          <TouchableOpacity
            onPress={() => {
              if (currentSpriteID > 1) {
                setCurrentSpriteID(currentSpriteID - 1);
              } else {
                setCurrentSpriteID(30);
              }
            }}
          >
            <Ionicons name="chevron-back" size={30} color={'black'} />
          </TouchableOpacity>
          <View className="relative items-center justify-center w-[100px] h-[100px] overflow-hidden">
            <View className="absolute bottom-0 flex-row justify-center items-end">
              <AnimatedSprite
                id={spriteID}
                state={SpriteState.IDLE}
                width={160}
                height={160}
                duration={1500}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (currentSpriteID < 30) {
                setCurrentSpriteID(currentSpriteID + 1);
              } else {
                setCurrentSpriteID(1);
              }
            }}
          >
            <Ionicons name="chevron-forward" size={30} color={'black'} />
          </TouchableOpacity>
        </View>
        <View className="justify-center items-center mb-10">
          <Text className="text-lg font-medium mr-2">
            Sprite {currentSpriteID}
          </Text>
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
