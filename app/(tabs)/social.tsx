import { FlatList, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserFriend } from '@/types/friend';
import { BASE_USER } from '@/constants/user';

const MOCK_USER_FRIENDS: UserFriend = {
  id: '1',
  friends: [
    {
      ...BASE_USER,
      id: 'fggosi',
      profileInfo: { ...BASE_USER.profileInfo, username: 'NiceDude1' },
    },
  ],
  sentRequests: ['jdoe@mail.com', 'bdover@mail.com', 'apee@mail.com'],
  pendingRequests: [
    {
      ...BASE_USER,
      id: 'sgag',
      profileInfo: {
        ...BASE_USER.profileInfo,
        username: 'KindaCoolDude',
      },
    },
    {
      ...BASE_USER,
      id: 'fwfafof',
      profileInfo: { ...BASE_USER.profileInfo, username: 'VeryCoolDude2' },
    },
  ],
};

const Social = () => {
  // const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView className="relative w-full h-full flex-1 flex-col justify-start items-start bg-off-white px-6 py-8">
      <Text className="text-2xl text-gray-black mb-5">Social</Text>

      <View className="w-full mb-5">
        <Text className="text-xl text-gray-black font-bold mb-2">
          SENT REQUESTS
        </Text>
        <FlatList
          data={MOCK_USER_FRIENDS.sentRequests}
          keyExtractor={(friend) => friend}
          renderItem={({ item }) => (
            <Text className="text-lg font-medium">{item}</Text>
          )}
        />
      </View>

      <View className="w-full mb-5">
        <Text className="text-xl text-gray-black font-bold mb-2">
          INCOMING REQUESTS
        </Text>
        <FlatList
          data={MOCK_USER_FRIENDS.pendingRequests}
          keyExtractor={(friend) => friend.id}
          renderItem={({ item }) => (
            <Text className="text-lg font-medium">
              {item.profileInfo.username}
            </Text>
          )}
        />
      </View>

      <View className="w-full mb-5">
        <Text className="text-xl text-gray-black font-bold mb-2">FRIENDS</Text>
        <FlatList
          data={MOCK_USER_FRIENDS.friends}
          keyExtractor={(friend) => friend.id}
          renderItem={({ item }) => (
            <Text className="text-lg font-medium">
              {item.profileInfo.username}
            </Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Social;

// const FriendItem: React.FC<{ item: Item; onPress: () => void }> = ({
//   item,
//   onPress,
// }) => {
//   return (
//     <View className="flex-col justify-center items-center">
//       <Text className="text-lg text-gold mb-5 font-semibold">
//         {item.cost} Gold
//       </Text>
//     </View>
//   );
// };
