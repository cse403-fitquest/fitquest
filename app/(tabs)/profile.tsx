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
import { useState } from 'react';
import FQModal from '@/components/FQModal';
//import { User } from '@/types/user';
import { Item, ItemType } from '@/types/item';
import { updateUserProfile } from '@/services/user';
import { signOut } from '@/services/auth';
import { useUserStore } from '@/store/user';
import { useItemStore } from '@/store/item';
import { useSocialStore } from '@/store/social';
//import { BASE_USER } from '@/constants/user';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { Sprite } from '@/components/Sprite';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import clsx from 'clsx';

interface ItemCardProps {
  item: Item;
  onPress: () => void;
}

const ItemCard = ({ item, onPress }: ItemCardProps) => {
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
          },
        )}
      >
        <Sprite id={item.spriteID} width={70} height={70} />
      </TouchableOpacity>
      <Text className="text-lg text-gold mb-5 font-semibold">
        {item.cost} Gold
      </Text>
    </View>
  );
};

const Profile = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  // Helper function to fill missing user fields in DB
  // useEffect(() => {
  //   void fillMissingUserFields();
  // }, []);

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

  const handleEquipItem = (item: Item) => {
    // TODO: Implement actual equipping logic
    console.log('Equipping item:', item);
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

  if (!user) {
    return;
  }

  // Get the user's items from the store
  // const userItemIds = [
  //   ...user.equipments,
  //   ...user.consumables,
  //   ...user.equippedItems,
  // ];

  // const userItems = items.filter((item: { id: string }) =>
  //   userItemIds.includes(item.id),
  // );

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

        {/* Experience Bar */}
        <View className="mb-4">
          <View className="border border-gray rounded">
            <View className="w-full h-2 bg-gray-200 rounded">
              <View className="w-1/3 h-full bg-yellow rounded" />
            </View>
          </View>

          <Text className="text-xs text-center text-gray-500 mt-1">
            300 EXP TILL LEVEL
          </Text>
        </View>

        <View className="mb-6">
          <Text className="font-bold text-xl text-grayDark mb-2">
            ATTRIBUTES
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500">
                Power: {user?.attributes.power}
              </Text>
              <Ionicons name="information-circle-outline" size={16} />
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500">
                Speed: {user?.attributes.speed}
              </Text>
              <Ionicons name="information-circle-outline" size={16} />
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500">
                Health: {user?.attributes.health}
              </Text>
              <Ionicons name="information-circle-outline" size={16} />
            </View>
          </View>
        </View>

        {/* Items Grid */}
        <View className="mt-8">
          <Text className="font-bold mb-2 text-xl text-grayDark">ITEMS</Text>
          {items.length > 0 ? (
            <View className="flex-row flex-wrap gap-y-4">
              {items.map((item: Item) => (
                <View key={item.id} className="w-1/3 flex items-center">
                  <ItemCard item={item} onPress={() => setSelectedItem(item)} />
                </View>
              ))}
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
              {[5, 2, 3, 1, 0].map((value) => (
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
        title={`Equip ${selectedItem?.name}`}
        onConfirm={() => handleEquipItem(selectedItem!)}
      >
        <View className="p-4">
          <Text className="text-xl font-bold mb-2">
            Equip {selectedItem?.name}?
          </Text>
          <Text className="text-gray-500 mb-2">{selectedItem?.type}</Text>

          <View className="mb-4">
            <Text className="mb-2">{selectedItem?.description}</Text>

            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text>Power: {selectedItem?.power}</Text>
                <Text
                  className={
                    selectedItem?.power && selectedItem.power > 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {selectedItem?.power && selectedItem.power > 0
                    ? `+${selectedItem?.power}`
                    : selectedItem?.power}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text>Speed: {selectedItem?.speed}</Text>
                <Text
                  className={
                    selectedItem?.speed && selectedItem.speed > 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {selectedItem?.speed && selectedItem.speed > 0
                    ? `+${selectedItem?.speed}`
                    : selectedItem?.speed}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text>Health: {selectedItem?.health}</Text>
                <Text
                  className={
                    selectedItem?.health && selectedItem.health > 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {selectedItem?.health && selectedItem.health > 0
                    ? `+${selectedItem?.health}`
                    : selectedItem?.health}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setSelectedItem(null)}
              className="px-4 py-2"
            >
              <Text className="text-red-500">CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleEquipItem(selectedItem!)}
              className="px-4 py-2"
            >
              <Text className="text-blue-500">EQUIP ITEM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </FQModal>
    </SafeAreaView>
  );
};

export default Profile;
