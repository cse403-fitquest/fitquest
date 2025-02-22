import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  DimensionValue,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import FQModal from '@/components/FQModal';
import { Item, ItemType } from '@/types/item';
import { updateUserProfile } from '@/services/user';
import { signOut } from '@/services/auth';
import { useUserStore } from '@/store/user';
import { useItemStore } from '@/store/item';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { Sprite } from '@/components/Sprite';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import clsx from 'clsx';
import { getUserExpThreshold } from '@/utils/user';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { BASE_ITEM } from '@/constants/item';
import { User } from '@/types/user';
import {
  getUserHealthPotionsCountFromItems,
  itemTypeToString,
} from '@/utils/item';
// import { useSocialStore } from '@/store/social';

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
  // const [statContributions, setStatContributions] = useState<
  //   StatContributions[]
  // >([]);
  // // const statContributions: StatContributions[] = [];
  // const [totalStats, setTotalStats] = useState<{
  //   power: number;
  //   health: number;
  //   speed: number;
  // }>({
  //   power: 0,
  //   health: 0,
  //   speed: 0,
  // });
  // const totalStats = {
  //   power: 0,
  //   health: 0,
  //   speed: 0,
  // };

  const { user, setUser } = useUserStore();
  const { items } = useItemStore();
  // const { userFriend, setUserFriend, resetSocialStore } = useSocialStore();

  const [isCurrentQuestPublic, setIsCurrentQuestPublic] = useState(
    user?.privacySettings.isCurrentQuestPublic,
  );
  const [isLastWorkoutPublic, setIsLastWorkoutPublic] = useState(
    user?.privacySettings.isLastWorkoutPublic,
  );

  // const [username, setUsername] = useState(user?.profileInfo.username || '');

  const [height, setHeight] = useState(
    user?.profileInfo.height?.toString() || '',
  );
  const [weight, setWeight] = useState(
    user?.profileInfo.weight?.toString() || '',
  );

  const [workoutData, setWorkoutData] = useState<{
    weeks: string[];
    counts: number[];
    rawCounts: number[];
  }>({ weeks: [], counts: [], rawCounts: [] });

  useEffect(() => {
    if (user?.workoutHistory) {
      const data = getWeeklyWorkoutData(user);
      setWorkoutData(data);
    }
  }, [user?.workoutHistory]);

  const isItemEquipped = selectedItem
    ? user?.equippedItems.includes(selectedItem.id)
    : false;

  const userExpTillLevelUp = useMemo(() => {
    if (!user) return 0;

    return getUserExpThreshold(user) - user.exp;
  }, [user]);

  if (!user) {
    return <Text>Loading...</Text>;
  }
  // Memoized calculations for stats and contributions
  const { totalStats, contributions } = useMemo(() => {
    let computedPower = user.attributes.power;
    let computedHealth = user.attributes.health;
    let computedSpeed = user.attributes.speed;
    const contributionsArray: StatContributions[] = [];

    const equipped = items.filter((item) =>
      user.equippedItems.includes(item.id),
    );

    equipped.forEach((item) => {
      computedPower += item.power;
      computedHealth += item.health;
      computedSpeed += item.speed;

      contributionsArray.push({
        name: item.name,
        power: item.power,
        health: item.health,
        speed: item.speed,
      });
    });

    return {
      totalStats: {
        power: computedPower,
        health: computedHealth,
        speed: computedSpeed,
      },
      contributions: contributionsArray,
    };
  }, [user, items]);

  const userExpBarWidth: DimensionValue = useMemo(() => {
    if (!user) return `0%`;

    return `${(user.exp / getUserExpThreshold(user)) * 100}%` as DimensionValue;
  }, [user]);

  const equippedItemModalChildren = useMemo(() => {
    if (!user || !selectedItem) return null;

    const userEquipments = user.equippedItems.map((id) => {
      const equipment = items.find((item) => item.id === id);
      if (!equipment) {
        console.error('User equipment not found:', id);
        return { ...BASE_ITEM, id: id, name: 'Unknown Equipment' };
      }
      return equipment;
    });

    if (
      [ItemType.WEAPON, ItemType.ARMOR, ItemType.ACCESSORY].includes(
        selectedItem.type,
      )
    ) {
      // Compare selected item with user's current equipment
      const userEquippedItem = userEquipments.find(
        (i) => i.type === selectedItem.type,
      ) || {
        ...BASE_ITEM,
        power: 0,
        speed: 0,
        health: 0,
      };

      let powerDiff = selectedItem.power - userEquippedItem.power;
      let speedDiff = selectedItem.speed - userEquippedItem.speed;
      let healthDiff = selectedItem.health - userEquippedItem.health;

      let selectedItemPower = selectedItem.power;
      let selectedItemSpeed = selectedItem.speed;
      let selectedItemHealth = selectedItem.health;

      // Check if the selected item is already equipped
      // In which case, display the stats as if the item is unequipped
      if (isItemEquipped) {
        powerDiff = -userEquippedItem.power;
        speedDiff = -userEquippedItem.speed;
        healthDiff = -userEquippedItem.health;

        selectedItemPower = 0;
        selectedItemSpeed = 0;
        selectedItemHealth = 0;
      }

      return (
        <View>
          <View className="justify-center items-center h-[120px] mt-3 mb-5">
            <Sprite id={selectedItem.spriteID} width={120} height={120} />
          </View>
          <Text className="mb-5">{selectedItem.description}</Text>
          <View className="flex-row justify-evenly items-center mb-5">
            <View>
              <Text className="font-medium">Power:</Text>
              <Text className="font-medium">Speed:</Text>
              <Text className="font-medium">Health:</Text>
            </View>
            <View className="justify-center items-center">
              <Text className="font-bold">{userEquippedItem.power}</Text>
              <Text className="font-bold">{userEquippedItem.speed}</Text>
              <Text className="font-bold">{userEquippedItem.health}</Text>
            </View>
            <View>
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color="black"
              />
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color="black"
              />
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color="black"
              />
            </View>
            <View className="justify-center items-center">
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItemPower > userEquippedItem.power,
                  'text-red-500': selectedItemPower < userEquippedItem.power,
                })}
              >
                {selectedItemPower}
              </Text>
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItemSpeed > userEquippedItem.speed,
                  'text-red-500': selectedItemSpeed < userEquippedItem.speed,
                })}
              >
                {selectedItemSpeed}
              </Text>
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItemHealth > userEquippedItem.health,
                  'text-red-500': selectedItemHealth < userEquippedItem.health,
                })}
              >
                {selectedItemHealth}
              </Text>
            </View>
            <View className="justify-center items-start">
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItemPower > userEquippedItem.power,
                  'text-red-500': selectedItemPower < userEquippedItem.power,
                })}
              >
                {powerDiff == 0
                  ? null
                  : powerDiff > 0
                    ? `+${powerDiff}`
                    : powerDiff}
              </Text>
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItemSpeed > userEquippedItem.speed,
                  'text-red-500': selectedItemSpeed < userEquippedItem.speed,
                })}
              >
                {speedDiff == 0
                  ? null
                  : speedDiff > 0
                    ? `+${speedDiff}`
                    : speedDiff}
              </Text>
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItemHealth > userEquippedItem.health,
                  'text-red-500': selectedItemHealth < userEquippedItem.health,
                })}
              >
                {healthDiff == 0
                  ? null
                  : healthDiff > 0
                    ? `+${healthDiff}`
                    : healthDiff}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    // Only non-equipment items left are consumables
    let healthPotionsCount = 0;

    const [
      userSmallHealthPotCount,
      userMediumHealthPotCount,
      userLargeHealthPotCount,
    ] = getUserHealthPotionsCountFromItems(user, items);

    if (selectedItem.type === ItemType.POTION_SMALL) {
      healthPotionsCount = userSmallHealthPotCount;
    } else if (selectedItem.type === ItemType.POTION_MEDIUM) {
      healthPotionsCount = userMediumHealthPotCount;
    } else if (selectedItem.type === ItemType.POTION_LARGE) {
      healthPotionsCount = userLargeHealthPotCount;
    }

    return (
      <View>
        <View className="justify-center items-center h-24 my-5">
          <View className="justify-center items-center h-[120px] mt-3 mb-5">
            <Sprite id={selectedItem.spriteID} width={120} height={120} />
          </View>
        </View>
        <Text className="mb-2">{selectedItem.description}</Text>
        <Text className="mb-5">
          You currently own{' '}
          <Text className="font-bold">{healthPotionsCount}</Text> of this
          consumable.
        </Text>
      </View>
    );
  }, [selectedItem, user]);

  // Calculate total stats based on user profile and equipped items
  /*useEffect(() => {
    if (!user) return;

    // Base stats from user profile
    // let computedPower = user.attributes.power;
    // let computedHealth = user.attributes.health;
    // let computedSpeed = user.attributes.speed;

    const contributions: StatContributions[] = [];

    // Fetch equipped items
    const equipped = items.filter((item) =>
      user.equippedItems.includes(item.id),
    );

    equipped.forEach((item) => {
      // computedPower += item.power;
      // computedHealth += item.health;
      // computedSpeed += item.speed;

      contributions.push({
        name: item.name,
        power: item.power,
        health: item.health,
        speed: item.speed,
      });
    });

    // setTotalStats({
    //   power: computedPower,
    //   health: computedHealth,
    //   speed: computedSpeed,
    // });

    // setStatContributions(contributions);
  }, [user, items]);*/

  // Function to handle equipping an item
  const handleEquipItem = async (item: Item) => {
    if (!user) return;

    if (
      !user ||
      item.type === ItemType.POTION_SMALL ||
      item.type === ItemType.POTION_MEDIUM ||
      item.type === ItemType.POTION_LARGE
    ) {
      Alert.alert('Cannot equip potions');
      return;
    }

    try {
      const itemType = item.type;

      // Find if there's an already equipped item of the same type
      const existingEquippedItemId = user.equippedItems.find(
        (equippedItemId) => {
          const equippedItem = items.find((i) => i.id === equippedItemId);
          return equippedItem?.type === itemType;
        },
      );

      let newEquippedItems = [...user.equippedItems];
      let swappedItem: Item | null = null;

      if (existingEquippedItemId) {
        // If an item of the same type is already equipped, swap it
        const existingItemIndex = newEquippedItems.findIndex(
          (id) => id === existingEquippedItemId,
        );

        if (existingItemIndex !== -1) {
          swappedItem =
            items.find((i) => i.id === existingEquippedItemId) || null;
          newEquippedItems = newEquippedItems.map((id, index) =>
            index === existingItemIndex ? item.id : id,
          );
          // newEquippedItems[existingItemIndex] = item.id;
        }
      } else {
        // No existing item of the same type, simply add the new item
        newEquippedItems = [...newEquippedItems, item.id];
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

        if (swappedItem) {
          Alert.alert(
            'Item Swapped',
            `Swapped ${swappedItem.name} with ${item.name}.`,
          );
        } else {
          Alert.alert('Item Equipped', `${item.name} has been equipped.`);
        }

        console.log('After equip, newEquippedItems: ', newEquippedItems);
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

    if (
      !user ||
      item.type === ItemType.POTION_SMALL ||
      item.type === ItemType.POTION_MEDIUM ||
      item.type === ItemType.POTION_LARGE
    ) {
      Alert.alert('Cannot unequip potions');
      return;
    }

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
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    // Check if there are actual changes
    const hasChanges =
      // username.trim() !== user.profileInfo.username ||
      parseFloat(height) !== user.profileInfo.height ||
      parseFloat(weight) !== user.profileInfo.weight ||
      isCurrentQuestPublic !== user.privacySettings.isCurrentQuestPublic ||
      isLastWorkoutPublic !== user.privacySettings.isLastWorkoutPublic;

    if (!hasChanges) {
      Alert.alert(
        'No changes detected',
        'Please make changes before confirming.',
      );
      return; // Exit if no changes
    }

    // if (!username.trim() || username.trim().length < 4) {
    //   Alert.alert(
    //     'Validation Error',
    //     'Username must be at least 4 characters long.',
    //   );
    //   return;
    // }

    const parsedHeight = parseFloat(height);
    const parsedWeight = parseFloat(weight);

    if (isNaN(parsedHeight) || parsedHeight <= 0) {
      Alert.alert('Validation Error', 'Height must be a positive number.');
      return;
    }

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      Alert.alert('Validation Error', 'Weight must be a positive number.');
      return;
    }

    const updates: Partial<User> = {
      profileInfo: {
        ...user.profileInfo,
        // username: username.trim(),
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
        profileInfo: updates.profileInfo ?? user.profileInfo,
        privacySettings: updates.privacySettings ?? user.privacySettings,
      });
      Alert.alert('Profile updated successfully');
      setIsSettingsVisible(false);
    } else {
      Alert.alert('Error updating profile', response.error || '');
    }
  };

  const closeSettingsModal = () => {
    // Reset the state to the user's actual profile info
    // setUsername(user?.profileInfo.username || '');
    setHeight(user?.profileInfo.height?.toString() || '');
    setWeight(user?.profileInfo.weight?.toString() || '');
    setIsCurrentQuestPublic(
      user?.privacySettings.isCurrentQuestPublic ?? false,
    );
    setIsLastWorkoutPublic(user?.privacySettings.isLastWorkoutPublic ?? false);
    setIsSettingsVisible(false);
  };

  const openStatBreakdownModal = (stat: 'power' | 'health' | 'speed') => {
    setSelectedStatForBreakdown(stat);
    setStatBreakdownModalVisible(true);
  };

  const getStatBreakdown = (stat: 'power' | 'health' | 'speed') => {
    const baseStat = user?.attributes[stat] ?? 0;
    const totalContribution = contributions.reduce(
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
        {contributions
          .filter((contribution) => contribution[stat] !== 0)
          .map((contribution, index) => (
            <View key={index} className="flex-row justify-between mb-3">
              <Text className="text-lg">{contribution.name}</Text>
              <Text
                className={`${'text-lg'}
                totalStat > baseStat
                  ? 'text-green'
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
                ? 'text-green'
                : totalStat < baseStat
                  ? 'text-red-500'
                  : 'text-gray'`}
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

  // Type priority for item sorting
  const typePriority: { [key in ItemType]: number } = {
    [ItemType.WEAPON]: 1,
    [ItemType.ARMOR]: 2,
    [ItemType.ACCESSORY]: 3,
    [ItemType.POTION_SMALL]: 4,
    [ItemType.POTION_MEDIUM]: 4,
    [ItemType.POTION_LARGE]: 4,
  };

  // Get the user's items from the store
  const userItemIds = [
    ...user.equipments,
    ...user.consumables,
    ...user.equippedItems,
  ];

  const userItems = items
    .filter((item: { id: string }) => userItemIds.includes(item.id))
    .sort((a, b) => {
      const aPriority = typePriority[a.type] || 99;
      const bPriority = typePriority[b.type] || 99;

      if (aPriority < bPriority) return -1;
      if (aPriority > bPriority) return 1;
      return 0;
    });

  function capitalize(selectedStatForBreakdown: string) {
    return (
      selectedStatForBreakdown.charAt(0).toUpperCase() +
      selectedStatForBreakdown.slice(1)
    );
  }

  const getWeeklyWorkoutData = (user: User) => {
    const weeks = [];
    const counts = [];
    const rawCounts = [];
    const MAX_SEGMENTS = 6;

    // Get this week's Monday
    const today = new Date();
    const currentWeekMonday = new Date(today);
    const diff = currentWeekMonday.getDate() - currentWeekMonday.getDay() + 1;
    currentWeekMonday.setDate(diff);
    currentWeekMonday.setHours(0, 0, 0, 0);

    // Go back 4 weeks from this Monday
    const startDate = new Date(currentWeekMonday);
    startDate.setDate(startDate.getDate() - 4 * 7);

    // Move forward 5 weeks, starting from each Monday
    for (let i = 0; i < 5; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekSunday = new Date(weekEnd);
      const weekLabel = `${weekSunday.getMonth() + 1}/${weekSunday.getDate()}`;
      weeks.push(weekLabel);

      const workoutCount =
        user?.workoutHistory?.filter((workout) => {
          // For some reason, the date is stored as an object with seconds and nanoseconds
          const workoutDate = workout.startedAt;
          return (
            workoutDate.getTime() >= weekStart.getTime() &&
            workoutDate.getTime() <= weekEnd.getTime()
          );
        }).length || 0;

      rawCounts.push(workoutCount);
      counts.push(Math.min(workoutCount, MAX_SEGMENTS));
    }

    return { weeks, counts, rawCounts };
  };

  return (
    <SafeAreaView className=" bg-offWhite">
      <ScrollView className="w-full h-full px-6 py-8">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-500">Welcome,</Text>
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

        <View className="mb-4">
          <View className="w-full border border-gray rounded">
            <View className="w-full h-2 bg-gray-200 rounded">
              <View
                className="h-full w-full bg-yellow border border-yellow rounded"
                style={{
                  width: userExpBarWidth,
                }}
              />
            </View>
          </View>

          <Text className="text-xs text-center text-gray-500 mt-1 mb-4">
            {userExpTillLevelUp} EXP TILL LEVEL UP
          </Text>
        </View>

        {/* Attributes Section */}
        <View className="text-lg mb-6">
          <View className="mb-2 flex-row items-center">
            <Text className="font-bold text-xl text-grayDark mr-2">
              ATTRIBUTES
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/allocate-points')}
              className="ml-2"
            >
              <Ionicons name="add-outline" size={30} color={Colors.blue} />
            </TouchableOpacity>
          </View>
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

        <View className="mt-8">
          <Text className="font-bold mb-8 text-xl text-grayDark">
            WORKOUTS PER WEEK
          </Text>

          <View className="mt-4">
            <View className="h-[200px] flex-row items-end justify-between mb-2">
              {workoutData.counts.map((count, index) => (
                <View key={index} className="w-16 items-center">
                  {/* Overflow count */}
                  {workoutData.rawCounts[index] > 6 && (
                    <Text className="text-xs text-gray-500 mb-1">
                      +{workoutData.rawCounts[index] - 6}
                    </Text>
                  )}
                  {/* Bar */}
                  <View
                    className="w-full border-t border-green-600"
                    style={{
                      height: Math.min(count, 6) * 30,
                      backgroundColor: '#22C55E',
                      position: 'relative',
                    }}
                  >
                    {/* Segment lines */}
                    {Array.from({ length: Math.min(count, 6) - 1 }).map(
                      (_, i) => (
                        <View
                          key={i}
                          className="absolute w-full border-b border-white"
                          style={{
                            top: (i + 1) * 30,
                          }}
                        />
                      ),
                    )}
                  </View>
                </View>
              ))}
            </View>

            <View className="flex-row justify-between h-[50px]">
              {workoutData.weeks.map((date) => (
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
        setVisible={closeSettingsModal}
        title="Profile Settings"
        onConfirm={handleUpdateProfile}
        closeButton
      >
        <View className="py-4 w-[220px] relative">
          <View className="space-y-4 mt-4">
            {/* <View>
              <Text className="text-gray-500 mb-1">Username</Text>
              <TextInput
                className="p-2 border border-gray-300 rounded"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
              />
            </View> */}

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
          selectedItem?.type.startsWith('POTION')
            ? selectedItem?.name
            : isItemEquipped
              ? `Unequip ${selectedItem?.name}`
              : `Equip ${selectedItem?.name}`
        }
        cancelText={
          selectedItem?.type.startsWith('POTION') ? undefined : 'CANCEL'
        }
        onConfirm={() =>
          selectedItem
            ? selectedItem.type.startsWith('POTION')
              ? setSelectedItem(null)
              : isItemEquipped
                ? handleUnequipItem(selectedItem)
                : handleEquipItem(selectedItem)
            : null
        }
        confirmText={
          selectedItem?.type.startsWith('POTION')
            ? 'OK'
            : isItemEquipped
              ? 'UNEQUIP'
              : 'EQUIP'
        }
        onCancel={
          selectedItem?.type.startsWith('POTION')
            ? undefined
            : () => setSelectedItem(null)
        }
        subtitle={selectedItem ? itemTypeToString(selectedItem.type) : ''}
      >
        {equippedItemModalChildren}
      </FQModal>

      {/* Stat Breakdown Modal */}
      <FQModal
        title={`${capitalize(selectedStatForBreakdown)} Breakdown`}
        visible={statBreakdownModalVisible}
        setVisible={setStatBreakdownModalVisible}
        onConfirm={() => setStatBreakdownModalVisible(false)}
        confirmText="OK"
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
