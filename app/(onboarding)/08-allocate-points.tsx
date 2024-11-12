import FQButton from '@/components/FQButton';
import { Colors } from '@/constants/Colors';
import { BASE_ATTRIBUTES } from '@/constants/onboarding';
import { useOnboardingStore } from '@/store/onboarding';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';

const OnboardingAllocatePoints = () => {
  const { currentPoints, setCurrentPoints, attributes, setAttributes } =
    useOnboardingStore();

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
              <Text className="text-2xl font-bold">{attributes.power}</Text>
            </View>
            <View className="flex-row items-center justify-center">
              {attributes.power > BASE_ATTRIBUTES.power ? (
                <TouchableOpacity
                  className="w-[35px] h-[30px] items-center"
                  onPress={() => {
                    setAttributes({
                      ...attributes,
                      power: attributes.power - 1,
                    });
                    setCurrentPoints(currentPoints + 1);
                  }}
                >
                  <Ionicons name="remove" size={30} color={'red'} />
                </TouchableOpacity>
              ) : (
                <View className="w-[35px]" />
              )}
              {currentPoints > 0 ? (
                <TouchableOpacity
                  className="w-[35px] h-[30px] items-center mr-2"
                  onPress={() => {
                    setAttributes({
                      ...attributes,
                      power: attributes.power + 1,
                    });
                    setCurrentPoints(currentPoints - 1);
                  }}
                >
                  <Ionicons name="add-outline" size={30} color={Colors.blue} />
                </TouchableOpacity>
              ) : (
                <View className="w-[35px] mr-2" />
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
              <Text className="text-2xl font-bold">{attributes.speed}</Text>
            </View>
            <View className="flex-row items-center justify-center">
              {attributes.speed > BASE_ATTRIBUTES.speed ? (
                <TouchableOpacity
                  className="w-[35px] h-[30px] items-center"
                  onPress={() => {
                    setAttributes({
                      ...attributes,
                      speed: attributes.speed - 1,
                    });
                    setCurrentPoints(currentPoints + 1);
                  }}
                >
                  <Ionicons name="remove" size={30} color={'red'} />
                </TouchableOpacity>
              ) : (
                <View className="w-[35px]" />
              )}
              {currentPoints > 0 ? (
                <TouchableOpacity
                  className="w-[35px] h-[30px] items-center mr-2"
                  onPress={() => {
                    setAttributes({
                      ...attributes,
                      speed: attributes.speed + 1,
                    });
                    setCurrentPoints(currentPoints - 1);
                  }}
                >
                  <Ionicons name="add-outline" size={30} color={Colors.blue} />
                </TouchableOpacity>
              ) : (
                <View className="w-[35px] mr-2" />
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
              <Text className="text-2xl font-bold">{attributes.health}</Text>
            </View>
            <View className="flex-row items-center justify-center">
              {attributes.health > BASE_ATTRIBUTES.health ? (
                <TouchableOpacity
                  className="w-[35px] h-[30px] items-center"
                  onPress={() => {
                    setAttributes({
                      ...attributes,
                      health: attributes.health - 1,
                    });
                    setCurrentPoints(currentPoints + 1);
                  }}
                >
                  <Ionicons name="remove" size={30} color={'red'} />
                </TouchableOpacity>
              ) : (
                <View className="w-[35px]" />
              )}
              {currentPoints > 0 ? (
                <TouchableOpacity
                  className="w-[35px] h-[30px] items-center mr-2"
                  onPress={() => {
                    setAttributes({
                      ...attributes,
                      health: attributes.health + 1,
                    });
                    setCurrentPoints(currentPoints - 1);
                  }}
                >
                  <Ionicons name="add-outline" size={30} color={Colors.blue} />
                </TouchableOpacity>
              ) : (
                <View className="w-[35px] mr-2" />
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
            setAttributes(attributes);
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
