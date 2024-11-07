import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import FQModal from '@/components/FQModal';
import { User } from '@/types/user';
import clsx from 'clsx';
import { Item, ItemType } from '@/types/item';
import { signOut } from '@/services/auth';
import { useUserStore } from '@/store/user';
import { useSocialStore } from '@/store/social';
import { BASE_USER } from '@/constants/user';

const MOCK_EQUIPPED_ITEMS: Item[] = [
  {
    id: '1',
    name: 'Sword',
    type: ItemType.WEAPON,
    cost: 100,
    description: 'A basic sword',
    power: 5,
    speed: -1,
    health: 0,
    spriteID: 'sword-sprite',
    createdAt: new Date(Date.now()),
  },
  {
    id: '2',
    name: 'Shield',
    type: ItemType.ARMOR,
    cost: 150,
    description: 'A basic shield',
    power: 0,
    speed: -2,
    health: 5,
    spriteID: 'shield-sprite',
    createdAt: new Date(Date.now()),
  },
  {
    id: '3',
    name: 'Helmet',
    type: ItemType.ARMOR,
    cost: 80,
    description: 'A sturdy helmet',
    power: 0,
    speed: 0,
    health: 3,
    spriteID: 'helmet-sprite',
    createdAt: new Date(Date.now()),
  },
  {
    id: '4',
    name: 'Boots',
    type: ItemType.ACCESSORY,
    cost: 60,
    description: 'Speedy boots',
    power: 0,
    speed: 2,
    health: 0,
    spriteID: 'boots-sprite',
    createdAt: new Date(Date.now()),
  },
  {
    id: '5',
    name: 'Potion',
    type: ItemType.POTION_SMALL,
    cost: 30,
    description: 'A small health potion',
    power: 0,
    speed: 0,
    health: 5,
    spriteID: 'potion-sprite',
    createdAt: new Date(Date.now()),
  },
];

// Mock user data
const MOCK_USER: User = {
  ...BASE_USER,
  id: 'mock-user-1',
  profileInfo: {
    email: 'cooldude1@email.com',
    username: 'CoolDude1',
    age: 25,
    height: 5.9,
    weight: 175,
  },
  spriteID: 'default-sprite',
  attributes: {
    power: 5,
    speed: 5,
    health: 7,
  },
  exp: 250,
  gold: 500,
  currentQuest: 'Hunt Big Chungus',
  privacySettings: {
    isLastWorkoutPublic: true,
    isCurrentQuestPublic: true,
  },
  createdAt: new Date(),
  attributePoints: 0,
};

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
          'rounded w-24 h-24 border border-gray bg-white shadow-lg shadow-black mb-2',
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
      ></TouchableOpacity>
      <Text className="text-lg text-gold mb-5 font-semibold">
        {item.cost} Gold
      </Text>
    </View>
  );
};

const Profile = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isCurrentQuestPublic, setIsCurrentQuestPublic] = useState(
    MOCK_USER.privacySettings.isCurrentQuestPublic,
  );
  const [isLastWorkoutPublic, setIsLastWorkoutPublic] = useState(
    MOCK_USER.privacySettings.isLastWorkoutPublic,
  );

  const { user } = useUserStore();
  const { resetSocialStore } = useSocialStore();

  const handleEquipItem = (item: Item) => {
    // TODO: Implement actual equipping logic
    console.log('Equipping item:', item);
    setSelectedItem(null);
  };

  const handleSignOut = async () => {
    const signOutResponse = await signOut();

    if (signOutResponse.error) {
      Alert.alert('Error signing out', signOutResponse.error);
    }

    resetSocialStore();
    return;
  };

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
          </View>
          <TouchableOpacity
            onPress={() => setIsSettingsVisible(true)}
            className="p-2"
          >
            <Ionicons name="settings-outline" size={24} />
          </TouchableOpacity>
        </View>

        <View className="h-48 items-center justify-center">
          <Image
            source={require('../../assets/images/react-logo.png')} // TODO: Replace with actual sprite, just used a placeholder image from assets for now
            className="w-32 h-32"
          />
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

        <View className=" mb-6">
          <Text className="font-bold text-xl text-grayDark mb-2">
            ATTRIBUTES
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500">
                Power: {MOCK_USER.attributes.power}
              </Text>
              <Ionicons name="information-circle-outline" size={16} />
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500">
                Speed: {MOCK_USER.attributes.speed}
              </Text>
              <Ionicons name="information-circle-outline" size={16} />
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500">
                Health: {MOCK_USER.attributes.health}
              </Text>
              <Ionicons name="information-circle-outline" size={16} />
            </View>
          </View>
        </View>

        {/* Items Grid */}
        <View className="">
          <Text className="font-bold mb-2 text-xl text-grayDark">ITEMS</Text>
          <View className="flex-row flex-wrap gap-y-4">
            {MOCK_EQUIPPED_ITEMS.map((item) => (
              <View key={item.id} className="w-1/3 flex items-center">
                <ItemCard item={item} onPress={() => setSelectedItem(item)} />
              </View>
            ))}
          </View>
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
        onConfirm={() => setIsSettingsVisible(false)}
        cancelText="CLOSE"
      >
        <View className="py-4 w-[220px]">
          <View className="space-y-4">
            <View>
              <Text className="text-gray-500 mb-1">Username</Text>
              <Text className="p-2 border border-gray-300 rounded">
                {MOCK_USER.profileInfo.username}
              </Text>
            </View>

            <View>
              <Text className="text-gray-500 mb-1">Height (ft)</Text>
              <Text className="p-2 border border-gray-300 rounded">
                {MOCK_USER.profileInfo.height}
              </Text>
            </View>

            <View>
              <Text className="text-gray-500 mb-1">Weight (lbs)</Text>
              <Text className="p-2 border border-gray-300 rounded">
                {MOCK_USER.profileInfo.weight}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500">Share Current Quest</Text>
              <TouchableOpacity
                onPress={() => setIsCurrentQuestPublic(!isCurrentQuestPublic)}
              >
                <Ionicons
                  name="square-outline"
                  size={24}
                  color={isCurrentQuestPublic ? '#007AFF' : '#000000'}
                />
                {isCurrentQuestPublic && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color="#007AFF"
                    style={{ position: 'absolute', left: 2, top: 2 }}
                  />
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-500">Share Last Workout Date</Text>
              <TouchableOpacity
                onPress={() => setIsLastWorkoutPublic(!isLastWorkoutPublic)}
              >
                <Ionicons
                  name="square-outline"
                  size={24}
                  color={isLastWorkoutPublic ? '#007AFF' : '#000000'}
                />
                {isLastWorkoutPublic && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color="#007AFF"
                    style={{ position: 'absolute', left: 2, top: 2 }}
                  />
                )}
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
