import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import FQModal from '@/components/FQModal';
import { Item, ItemType } from '@/types/item';
import { updateUserProfile } from '@/services/user';
import { signOut } from '@/services/auth';
import { useUserStore } from '@/store/user';
import { useItemStore } from '@/store/item';
import { useSocialStore } from '@/store/social';
import { AnimatedSpriteID, SpriteID, SpriteState } from '@/constants/sprite';
import { Sprite } from '@/components/Sprite';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import clsx from 'clsx';

interface ItemCardProps {
  item: Item;
  onPress: () => void;
  isEquipped: boolean;
}

const ItemCard = ({ item, onPress, isEquipped }: ItemCardProps) => {
  return (
    <View className="flex-col justify-center items-center">
      <TouchableOpacity
        onPress={onPress}
        className={clsx(
          'relative rounded w-24 h-24 border border-gray bg-white shadow-lg shadow-black mb-2 justify-center items-center',
          {
            'bg-red-800': item.type === ItemType.WEAPON,
            'bg-blue': item.type === ItemType.ARMOR,
            'bg-green': item.type === ItemType.ACCESSORY,
            'bg-pink': [
              ItemType.POTION_SMALL,
              ItemType.POTION_MEDIUM,
              ItemType.POTION_LARGE,
            ].includes(item.type),
            'border-4': isEquipped, // Increase border width if equipped
          },
        )}
      >
        <Sprite id={item.spriteID} width={70} height={70} />
        {isEquipped && (
          <View className="absolute top-0 right-0 bg-yellow-500 rounded-full p-1">
            <Ionicons name="checkmark-circle" size={24} color="white" />
          </View>
        )}
      </TouchableOpacity>
      <Text className="text-md text-black mb-5 font-semibold">{item.name}</Text>
    </View>
  );
};

interface StatContributions {
  name: string;
  power: number;
  health: number;
  speed: number;
}

const Profile = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [statBreakdownModalVisible, setStatBreakdownModalVisible] =
    useState(false);
  const [selectedStatForBreakdown, setSelectedStatForBreakdown] = useState<
    'power' | 'health' | 'speed'
  >('power');
  const [statContributions, setStatContributions] = useState<
    StatContributions[]
  >([]);
  const [totalStats, setTotalStats] = useState<{
    power: number;
    health: number;
    speed: number;
  }>({
    power: 0,
    health: 0,
    speed: 0,
  });

  const { user, setUser } = useUserStore();
  const { items } = useItemStore();
  const { resetSocialStore } = useSocialStore();

  const [isCurrentQuestPublic, setIsCurrentQuestPublic] = useState(
    user?.privacySettings.isCurrentQuestPublic,
  );
  const [isLastWorkoutPublic, setIsLastWorkoutPublic] = useState(
    user?.privacySettings.isLastWorkoutPublic,
  );

  const [username, setUsername] = useState(user?.profileInfo.username || '');

  const [height, setHeight] = useState(
    user?.profileInfo.height?.toString() || '',
  );
  const [weight, setWeight] = useState(
    user?.profileInfo.weight?.toString() || '',
  );

  const isItemEquipped = selectedItem
    ? user?.equippedItems.includes(selectedItem.id)
    : false;

  // Calculate total stats based on user profile and equipped items
  useEffect(() => {
    if (!user) return;

    // Base stats from user profile
    let computedPower = user.attributes.power;
    let computedHealth = user.attributes.health;
    let computedSpeed = user.attributes.speed;

    const contributions: StatContributions[] = [];

    // Fetch equipped items
    const equipped = items.filter((item) =>
      user.equippedItems.includes(item.id),
    );

    equipped.forEach((item) => {
      computedPower += item.power;
      computedHealth += item.health;
      computedSpeed += item.speed;

      contributions.push({
        name: item.name,
        power: item.power,
        health: item.health,
        speed: item.speed,
      });
    });

    setTotalStats({
      power: computedPower,
      health: computedHealth,
      speed: computedSpeed,
    });

    setStatContributions(contributions);
  }, [user, items]);

  // Function to handle equipping an item
  const handleEquipItem = async (item: Item) => {
    if (!user) return;

    try {
      // Determine the item's type
      const itemType = item.type;

      // Create a new array for equipped items
      const newEquippedItems = [...user.equippedItems];

      // Check if an item of the same type is already equipped
      const existingItemIndex = newEquippedItems.findIndex((equippedItemId) => {
        const equippedItem = items.find((i) => i.id === equippedItemId);
        return equippedItem?.type === itemType;
      });

      if (existingItemIndex !== -1) {
        // Replace the existing item with the new one
        newEquippedItems[existingItemIndex] = item.id;
      } else {
        // Add the new item
        newEquippedItems.push(item.id);
      }

      // Update the user's equipped items in Firestore
      const response = await updateUserProfile(user.id, {
        equippedItems: newEquippedItems,
      });

      if (response.success) {
        // Update the user in the store
        setUser({
          ...user,
          equippedItems: newEquippedItems,
        });
        Alert.alert('Item equipped successfully');
        console.log('after equip, newEquippedItems: ', newEquippedItems);
      } else {
        Alert.alert('Error equipping item', response.error || '');
      }
    } catch (error) {
      console.error('Error equipping item:', error);
      Alert.alert('Error', 'An error occurred while equipping the item.');
    }

    setSelectedItem(null);
  };

  const handleUnequipItem = async (item: Item) => {
    if (!user) return;

    try {
      const newEquippedItems = user.equippedItems.filter(
        (equippedItemId) => equippedItemId !== item.id,
      );

      const response = await updateUserProfile(user.id, {
        equippedItems: newEquippedItems,
      });

      if (response.success) {
        setUser({
          ...user,
          equippedItems: newEquippedItems,
        });
        Alert.alert('Item unequipped successfully');
        console.log('after unequip, newEquippedItems: ', newEquippedItems);
      } else {
        Alert.alert('Error unequipping item', response.error || '');
      }
    } catch (error) {
      console.error('Error unequipping item:', error);
      Alert.alert('Error', 'An error occurred while unequipping the item.');
    }

    setSelectedItem(null);
  };

  const handleSignOut = async () => {
    console.log('Signing out...');
    const signOutResponse = await signOut();

    console.log('Sign out response:', signOutResponse);
    if (signOutResponse.error) {
      Alert.alert('Error signing out', signOutResponse.error);
    }

    setUser(null);
    resetSocialStore();
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    const updates = {
      profileInfo: {
        ...user.profileInfo,
        username: username.trim(),
        height: parseFloat(height),
        weight: parseFloat(weight),
      },
      privacySettings: {
        isCurrentQuestPublic: isCurrentQuestPublic ?? false,
        isLastWorkoutPublic: isLastWorkoutPublic ?? false,
      },
    };

    const response = await updateUserProfile(user.id, updates);

    if (response.success) {
      // Update the user in the store
      setUser({
        ...user,
        profileInfo: updates.profileInfo,
        privacySettings: updates.privacySettings,
      });
      Alert.alert('Profile updated successfully');
    } else {
      Alert.alert('Error updating profile', response.error || '');
    }

    setIsSettingsVisible(false);
  };

  const openStatBreakdownModal = (stat: 'power' | 'health' | 'speed') => {
    setSelectedStatForBreakdown(stat);
    setStatBreakdownModalVisible(true);
  };

  const getStatBreakdown = (stat: 'power' | 'health' | 'speed') => {
    const baseStat = user?.attributes[stat] ?? 0;
    const totalContribution = statContributions.reduce(
      (total, contribution) => total + contribution[stat],
      0,
    );
    const totalStat = baseStat + totalContribution;

    return (
      <>
        {/* Base Stat */}
        <View className="flex-row justify-between mb-3">
          <Text className="text-lg">
            Base {stat.charAt(0).toUpperCase() + stat.slice(1)}
          </Text>
          <Text className="text-lg">{baseStat}</Text>
        </View>

        {/* Contributions */}
        {statContributions
          .filter((contribution) => contribution[stat] !== 0)
          .map((contribution, index) => (
            <View key={index} className="flex-row justify-between mb-3">
              <Text className="text-lg">{contribution.name}</Text>
              <Text
                className={`${'text-lg'}
                totalStat > baseStat
                  ? 'text-green-500'
                  : totalStat < baseStat
                    ? 'text-red-500'
                    : 'text-gray-500'`}
              >
                {contribution[stat] > 0
                  ? `+${contribution[stat]}`
                  : `${contribution[stat]}`}
              </Text>
            </View>
          ))}

        {/* Separator Line */}
        <View className="my-4 border-t border-gray-300" />

        {/* Total Stat */}
        <View className="flex-row justify-between">
          <Text className="font-bold text-xl">
            Total {stat.charAt(0).toUpperCase() + stat.slice(1)}
          </Text>
          <Text
            className={`${'font-bold text-xl'}
              totalStat > baseStat
                ? 'text-green-500'
                : totalStat < baseStat
                  ? 'text-red-500'
                  : 'text-gray-500'`}
          >
            {totalStat > baseStat ? `+${totalStat}` : `${totalStat}`}
          </Text>
        </View>
      </>
    );
  };

  if (!user) {
    return;
  }

  // Get the user's items from the store
  const userItemIds = [
    ...user.equipments,
    ...user.consumables,
    ...user.equippedItems,
  ];

  const userItems = items.filter((item: { id: string }) =>
    userItemIds.includes(item.id),
  );

  function capitalize(selectedStatForBreakdown: string) {
    return (
      selectedStatForBreakdown.charAt(0).toUpperCase() +
      selectedStatForBreakdown.slice(1)
    );
  }

  return (
    <SafeAreaView className=" bg-offWhite">
      <ScrollView className="w-full h-full px-6 py-8">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-500">Welcome back,</Text>
            <Text className="text-2xl font-bold">
              {user?.profileInfo.username || '-'}
            </Text>
            <Text className="text-xl text-gold font-semibold">
              Gold: {user?.gold}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsSettingsVisible(true)}
            className="p-2"
          >
            <Ionicons name="settings-outline" size={24} />
          </TouchableOpacity>
        </View>

        <View className="items-center justify-center h-[160px] overflow-hidden mb-10">
          <View className="absolute bottom-0">
            <AnimatedSprite
              id={user?.spriteID || AnimatedSpriteID.HERO_20}
              state={SpriteState.IDLE}
              width={200}
              height={200}
            />
          </View>
        </View>

        {/*
        <View className="mb-4">
          <View className="border border-gray rounded">
            <View className="w-full h-2 bg-gray-200 rounded">
              <View className="w-1/3 h-full bg-yellow rounded" />
            </View>
          </View>

          <Text className="text-xs text-center text-gray-500 mt-1 mb-4">
            300 EXP TILL LEVEL 10
          </Text>
        </View>
        */}

        {/* Attributes Section */}
        <View className="text-lg mb-6">
          <Text className="font-bold text-xl text-grayDark mb-2">
            ATTRIBUTES
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg text-gray-500">
                Power: {totalStats.power}
              </Text>
              <TouchableOpacity onPress={() => openStatBreakdownModal('power')}>
                <Ionicons name="information-circle-outline" size={24} />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-lg text-gray-500">
                Speed: {totalStats.speed}
              </Text>
              <TouchableOpacity onPress={() => openStatBreakdownModal('speed')}>
                <Ionicons name="information-circle-outline" size={24} />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-lg text-gray-500">
                Health: {totalStats.health}
              </Text>
              <TouchableOpacity
                onPress={() => openStatBreakdownModal('health')}
              >
                <Ionicons name="information-circle-outline" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Items Grid */}
        <View className="mt-2">
          <Text className="font-bold mb-2 text-xl text-grayDark">ITEMS</Text>
          {userItems.length > 0 ? (
            <View className="flex-row flex-wrap gap-y-4">
              {userItems.map((item: Item) => {
                const isEquipped = user.equippedItems.includes(item.id); // Determine if the item is equipped

                return (
                  <View key={item.id} className="w-1/3 flex items-center">
                    <ItemCard
                      item={item}
                      onPress={() => setSelectedItem(item)}
                      isEquipped={isEquipped} // Pass the equipped status to ItemCard
                    />
                  </View>
                );
              })}
            </View>
          ) : (
            <Text className="text-gray-500">
              You have no items. Visit the shop!
            </Text>
          )}
        </View>

        {/* Workouts per Week */}
        <View className="mt-8">
          <Text className="font-bold mb-8 text-xl text-grayDark">
            WORKOUTS PER WEEK
          </Text>

          <View className="mt-4">
            <View className="h-[250px] flex-row items-end justify-between mb-2">
              {[5, 2, 3, 1, 4].map((value) => (
                <View key={value} className="w-16">
                  {[...Array(value)].map((_, blockIndex) => (
                    <View
                      key={blockIndex}
                      className="h-12 w-full bg-green-500 border-t border-green-600"
                      style={{
                        backgroundColor: '#22C55E',
                      }}
                    />
                  ))}
                </View>
              ))}
            </View>

            <View className="flex-row justify-between h-[50px]">
              {['9/16', '9/23', '9/30', '10/7', '10/14'].map((date) => (
                <Text key={date} className="text-gray-500 text-sm">
                  {date}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* ScrollView end padding */}
        <View className="h-[30px]"></View>
      </ScrollView>

      <FQModal
        visible={isSettingsVisible}
        setVisible={setIsSettingsVisible}
        title="Profile Settings"
        onConfirm={handleUpdateProfile}
      >
        <View className="py-4 w-[220px] relative">
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setIsSettingsVisible(false)}
            style={{ position: 'absolute', top: 2, right: 2 }}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <View className="space-y-4 mt-4">
            <View>
              <Text className="text-gray-500 mb-1">Username</Text>
              <TextInput
                className="p-2 border border-gray-300 rounded"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
              />
            </View>

            <View>
              <Text className="text-gray-500 mb-1">Height (ft)</Text>
              <TextInput
                className="p-2 border border-gray-300 rounded"
                value={height}
                onChangeText={setHeight}
                keyboardType="decimal-pad"
                placeholder="Enter height"
              />
            </View>

            <View>
              <Text className="text-gray-500 mb-1">Weight (lbs)</Text>
              <TextInput
                className="p-2 border border-gray-300 rounded"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="Enter weight"
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500">Share Current Quest</Text>
              <TouchableOpacity
                onPress={() => setIsCurrentQuestPublic(!isCurrentQuestPublic)}
              >
                <Ionicons
                  name={isCurrentQuestPublic ? 'checkbox' : 'square-outline'}
                  size={24}
                  color="#007AFF"
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-500">Share Last Workout Date</Text>
              <TouchableOpacity
                onPress={() => setIsLastWorkoutPublic(!isLastWorkoutPublic)}
              >
                <Ionicons
                  name={isLastWorkoutPublic ? 'checkbox' : 'square-outline'}
                  size={24}
                  color="#007AFF"
                />
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={handleSignOut}>
                <Text className="text-red-500 text-center font-semibold text-sm">
                  SIGN OUT
                </Text>
              </TouchableOpacity>

              {/* Won't delete account for now */}
              {/* <TouchableOpacity>
                <Text className="text-red-500 text-center font-semibold text-sm">
                  DELETE ACCOUNT
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </FQModal>

      <FQModal
        visible={selectedItem !== null}
        setVisible={(visible) => !visible && setSelectedItem(null)}
        title={
          isItemEquipped
            ? `Unequip ${selectedItem?.name}`
            : `Equip ${selectedItem?.name}`
        }
        cancelText={'CANCEL'}
        onConfirm={() =>
          selectedItem &&
          (isItemEquipped
            ? handleUnequipItem(selectedItem)
            : handleEquipItem(selectedItem))
        }
        confirmText={isItemEquipped ? 'UNEQUIP' : 'EQUIP'}
        onCancel={() => setSelectedItem(null)}
        subtitle={selectedItem?.type}
      >
        <View className="py-4 ">
          <View className="w-full items-center mb-5">
            <Sprite
              id={selectedItem?.spriteID ?? SpriteID.T1_DAGGER}
              width={70}
              height={70}
            />
          </View>

          <View className="w-full items-center mb-5">
            <Text className="mb-2">{selectedItem?.description}</Text>
          </View>

          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text>Power: {selectedItem?.power}</Text>
              <Text>--{'>'}</Text>
              <Text
                className={
                  isItemEquipped
                    ? totalStats.power - (selectedItem?.power ?? 0) <
                      totalStats.power
                      ? 'text-red-500'
                      : 'text-green'
                    : totalStats.power + (selectedItem?.power ?? 0) >=
                        totalStats.power
                      ? 'text-green'
                      : 'text-red-500'
                }
              >
                {isItemEquipped
                  ? totalStats.power - (selectedItem?.power ?? 0)
                  : totalStats.power + (selectedItem?.power ?? 0)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text>Speed: {selectedItem?.speed}</Text>
              <Text>--{'>'}</Text>
              <Text
                className={
                  isItemEquipped
                    ? totalStats.speed - (selectedItem?.speed ?? 0) <
                      totalStats.speed
                      ? 'text-red-500'
                      : 'text-green'
                    : totalStats.speed + (selectedItem?.speed ?? 0) >=
                        totalStats.speed
                      ? 'text-green'
                      : 'text-red-500'
                }
              >
                {isItemEquipped
                  ? totalStats.speed - (selectedItem?.speed ?? 0)
                  : totalStats.speed + (selectedItem?.speed ?? 0)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text>Health: {selectedItem?.health}</Text>
              <Text>--{'>'}</Text>
              <Text
                className={
                  isItemEquipped
                    ? totalStats.health - (selectedItem?.health ?? 0) <
                      totalStats.health
                      ? 'text-red-500'
                      : 'text-green'
                    : totalStats.health + (selectedItem?.health ?? 0) >=
                        totalStats.health
                      ? 'text-green'
                      : 'text-red-500'
                }
              >
                {isItemEquipped
                  ? totalStats.health - (selectedItem?.health ?? 0)
                  : totalStats.health + (selectedItem?.health ?? 0)}
              </Text>
            </View>
          </View>
        </View>
      </FQModal>

      {/* Stat Breakdown Modal */}
      <FQModal
        title={`${capitalize(selectedStatForBreakdown)} Breakdown`}
        visible={statBreakdownModalVisible}
        setVisible={setStatBreakdownModalVisible}
        onConfirm={() => setStatBreakdownModalVisible(false)}
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={() => setStatBreakdownModalVisible(false)}
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>

        <View className="py-4 w-[220px] relative">
          {getStatBreakdown(selectedStatForBreakdown)}
        </View>
      </FQModal>
    </SafeAreaView>
  );
};

export default Profile;
