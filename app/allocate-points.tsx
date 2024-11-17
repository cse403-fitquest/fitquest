import FQButton from '@/components/FQButton';
import FQModal from '@/components/FQModal';
import { Colors } from '@/constants/colors';
import { updateUserProfile } from '@/services/user';
import { useUserStore } from '@/store/user';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const AllocatePoints = () => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [attributes, setAttributes] = useState({
    power: 0,
    speed: 0,
    health: 0,
  });

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useUserStore();

  const baseAttributes = useMemo(() => {
    if (!user)
      return {
        power: 0,
        speed: 0,
        health: 0,
      };

    return user?.attributes;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    setCurrentPoints(user.attributePoints);
    setAttributes(user.attributes);
  }, [user]);

  const handleConfirmAllocation = async () => {
    if (!user) return;

    const oldUser = user;

    setLoading(true);

    // Update user attributes
    const updateUserProfileResponse = await updateUserProfile(user?.id, {
      attributes,
      attributePoints: currentPoints,
    });

    setLoading(false);

    if (!updateUserProfileResponse.success) {
      Alert.alert('Error', 'Failed to update attributes');

      setUser(oldUser);
      return;
    }

    setUser({
      ...user,
      attributes,
      attributePoints: currentPoints,
    });

    router.replace('/profile');
  };

  return (
    <SafeAreaView className="relative w-full h-full px-10 py-8 justify-center items-center">
      <FQModal
        visible={confirmModalVisible}
        setVisible={setConfirmModalVisible}
        title="Allocate points"
        onConfirm={handleConfirmAllocation}
        width={250}
        cancelText="CANCEL"
      >
        <Text className="my-2">
          Are you sure you want to allocate these points?
        </Text>
      </FQModal>
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
              {attributes.power > baseAttributes.power ? (
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
              {attributes.speed > baseAttributes.speed ? (
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
              {attributes.health > baseAttributes.health ? (
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
            setConfirmModalVisible(true);
          }}
          className="mb-5"
          disabled={currentPoints === user?.attributePoints || loading}
        >
          {loading ? (
            <View className="h-full justify-center items-center">
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            'ALLOCATE'
          )}
        </FQButton>
        <FQButton
          onPress={() => router.back()}
          className="mb-5"
          secondary
          disabled={loading}
        >
          BACK
        </FQButton>
      </View>
    </SafeAreaView>
  );
};
export default AllocatePoints;
