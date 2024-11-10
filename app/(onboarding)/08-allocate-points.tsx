import FQButton from '@/components/FQButton';
import { Colors } from '@/constants/Colors';
import { ONBOARDING_FITNESS_LEVEL_POINTS } from '@/constants/onboarding';
import { useOnboardingStore } from '@/store/onboarding';
import { useUserStore } from '@/store/user';
import { computeFitnessLevel } from '@/utils/onboarding';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';

const OnboardingAllocatePoints = () => {
  const { frequency, length, intensity, experience, setNewAttributes } =
    useOnboardingStore();
  const { user } = useUserStore();

  const [currentPoints, setCurrentPoints] = useState(0);
  const [currentAttributes, setCurrentAttributes] = useState<{
    power: number;
    speed: number;
    health: number;
  }>({
    power: 5,
    speed: 5,
    health: 5,
  });

  const [baseAttributes, setBaseAttributes] = useState({
    power: 5,
    speed: 5,
    health: 5,
  });

  // Calculate the user's fitness level based on their answers to the onboarding questions
  const pointsToAllocate = useMemo(() => {
    const fl = computeFitnessLevel(frequency, length, intensity, experience);

    return ONBOARDING_FITNESS_LEVEL_POINTS[fl];
  }, [frequency, length, intensity, experience]);

  useEffect(() => {
    setCurrentPoints(pointsToAllocate);
  }, [pointsToAllocate]);

  useEffect(() => {
    if (user) {
      setCurrentAttributes(user.attributes);
      setBaseAttributes(user.attributes);
    }
  }, [user]);

  return (
    <SafeAreaView className="relative w-full h-full px-10 py-8 justify-center items-center">
      <View className="w-full">
        <View className="w-full items-center mb-10">
          <Text className="mb-2 text-lg font-medium">You have</Text>
          <Text className="text-4xl font-bold mb-2">
            {currentPoints} {currentPoints === 1 ? 'point' : 'points'}
          </Text>
          <Text className="mb-2 text-lg font-medium">to allocate</Text>
        </View>

        <View className="justify-center items-center mb-10">
          {/* POWER */}
          <View className="w-full flex-row justify-between items-center mb-5">
            <View className="flex-row justify-start items-center">
              <Text className="text-2xl font-medium">Power: </Text>
              <Text className="text-2xl font-bold">
                {currentAttributes.power}
              </Text>
            </View>
            <View className="flex-row items-center justify-center">
              {currentAttributes.power > baseAttributes.power ? (
                <TouchableOpacity
                  className="mr-3 w-[30px] h-[30px]"
                  onPress={() => {
                    setCurrentAttributes({
                      ...currentAttributes,
                      power: currentAttributes.power - 1,
                    });
                    setCurrentPoints(currentPoints + 1);
                  }}
                >
                  <Ionicons name="remove" size={30} color={'red'} />
                </TouchableOpacity>
              ) : (
                <View className="w-[30px]" />
              )}
              {currentPoints > 0 ? (
                <TouchableOpacity
                  className="mr-2 w-[30px] h-[30px]"
                  onPress={() => {
                    setCurrentAttributes({
                      ...currentAttributes,
                      power: currentAttributes.power + 1,
                    });
                    setCurrentPoints(currentPoints - 1);
                  }}
                >
                  <Ionicons name="add-outline" size={30} color={Colors.blue} />
                </TouchableOpacity>
              ) : (
                <View className="w-[30px]" />
              )}
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Power',
                    'This attribute determines how strong your attacks are.',
                  )
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={25}
                  className=""
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* SPEED */}
          <View className="w-full flex-row justify-between items-center mb-5">
            <View className="flex-row justify-start items-center">
              <Text className="text-2xl font-medium">Speed: </Text>
              <Text className="text-2xl font-bold">
                {currentAttributes.speed}
              </Text>
            </View>
            <View className="flex-row items-center justify-center">
              {currentAttributes.speed > baseAttributes.speed ? (
                <TouchableOpacity
                  className="mr-3 w-[30px] h-[30px]"
                  onPress={() => {
                    setCurrentAttributes({
                      ...currentAttributes,
                      speed: currentAttributes.speed - 1,
                    });
                    setCurrentPoints(currentPoints + 1);
                  }}
                >
                  <Ionicons name="remove" size={30} color={'red'} />
                </TouchableOpacity>
              ) : (
                <View className="w-[30px]" />
              )}
              {currentPoints > 0 ? (
                <TouchableOpacity
                  className="mr-2 w-[30px] h-[30px]"
                  onPress={() => {
                    setCurrentAttributes({
                      ...currentAttributes,
                      speed: currentAttributes.speed + 1,
                    });
                    setCurrentPoints(currentPoints - 1);
                  }}
                >
                  <Ionicons name="add-outline" size={30} color={Colors.blue} />
                </TouchableOpacity>
              ) : (
                <View className="w-[30px]" />
              )}
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Speed',
                    'This attribute determines how fast you get to your turn.',
                  )
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={25}
                  className=""
                />
              </TouchableOpacity>
            </View>
          </View>
          <View className="w-full flex-row justify-between items-center mb-5">
            <View className="flex-row justify-start items-center">
              <Text className="text-2xl font-medium">Health: </Text>
              <Text className="text-2xl font-bold">
                {currentAttributes.health}
              </Text>
            </View>
            <View className="flex-row items-center justify-center">
              {currentAttributes.health > baseAttributes.health ? (
                <TouchableOpacity
                  className="mr-3 w-[30px] h-[30px]"
                  onPress={() => {
                    setCurrentAttributes({
                      ...currentAttributes,
                      health: currentAttributes.health - 1,
                    });
                    setCurrentPoints(currentPoints + 1);
                  }}
                >
                  <Ionicons name="remove" size={30} color={'red'} />
                </TouchableOpacity>
              ) : (
                <View className="w-[30px]" />
              )}
              {currentPoints > 0 ? (
                <TouchableOpacity
                  className="mr-2 w-[30px] h-[30px]"
                  onPress={() => {
                    setCurrentAttributes({
                      ...currentAttributes,
                      health: currentAttributes.health + 1,
                    });
                    setCurrentPoints(currentPoints - 1);
                  }}
                >
                  <Ionicons name="add-outline" size={30} color={Colors.blue} />
                </TouchableOpacity>
              ) : (
                <View className="w-[30px]" />
              )}
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Health',
                    'This attribute determines how much health you have.',
                  )
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={25}
                  className=""
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <FQButton
          onPress={() => {
            setNewAttributes(currentAttributes);
            router.replace('./09-choose-avatar');
          }}
          className="mb-5"
          disabled={currentPoints > 0}
        >
          CHOOSE AVATAR
        </FQButton>
        <FQButton
          onPress={() => router.replace('./07-fitness-level')}
          className="mb-5"
          secondary
        >
          BACK
        </FQButton>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingAllocatePoints;
