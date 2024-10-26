import { FlatList, TouchableOpacity, Text, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserFriend } from '@/types/friend';
import { BASE_USER } from '@/constants/user';
import { User } from '@/types/auth';

const MOCK_USER_FRIENDS: UserFriend = {
  id: '1',
  friends: [
    {
      ...BASE_USER,
      id: 'faagsg',
      profileInfo: { ...BASE_USER.profileInfo, username: 'NiceDude5' },
      currentQuest: 'Hunt Big Chungus',
    },
    {
      ...BASE_USER,
      id: 'fggosi',
      profileInfo: { ...BASE_USER.profileInfo, username: 'NiceDude1' },
      currentQuest: 'Hunt Big Chungus',
    },
    {
      ...BASE_USER,
      id: 'fgsg',
      profileInfo: { ...BASE_USER.profileInfo, username: 'KindaNiceDude2' },
      currentQuest: 'Hunt The Swamp Hydra',
    },
    {
      ...BASE_USER,
      id: 'fssg',
      profileInfo: { ...BASE_USER.profileInfo, username: 'NiceeeeeDude3' },
      currentQuest: 'Hunt Big Chungus',
      privacySettings: {
        isCurrentQuestPublic: true,
        isLastWorkoutPublic: false,
      },
    },
    {
      ...BASE_USER,
      id: 'fsfsgg',
      profileInfo: { ...BASE_USER.profileInfo, username: 'CoolDude3' },
      currentQuest: 'Hunt Big Chungus',
      privacySettings: {
        isCurrentQuestPublic: false,
        isLastWorkoutPublic: true,
      },
    },
    {
      ...BASE_USER,
      id: 'fsfsfdfdgg',
      profileInfo: { ...BASE_USER.profileInfo, username: 'VeryCoolDude3' },
      currentQuest: 'Hunt Big Chungus',
      privacySettings: {
        isCurrentQuestPublic: false,
        isLastWorkoutPublic: false,
      },
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
    {
      ...BASE_USER,
      id: 'dfff',
      profileInfo: { ...BASE_USER.profileInfo, username: 'VeryCoolDude3' },
    },
  ],
};

const Social = () => {
  // const [modalVisible, setModalVisible] = useState(false);

  const [sections, setSections] = useState<
    { key: string; title: string; data: User[] | string[] }[]
  >([
    {
      key: 'sentRequests',
      title: 'SENT REQUESTS',
      data: MOCK_USER_FRIENDS.sentRequests,
    },
    {
      key: 'incomingRequests',
      title: 'INCOMING REQUESTS',
      data: MOCK_USER_FRIENDS.pendingRequests,
    },
    {
      key: 'friends',
      title: 'FRIENDS',
      data: MOCK_USER_FRIENDS.friends,
    },
  ]);

  const renderSection = (item: {
    key: string;
    title: string;
    data: User[] | string[];
  }) => {
    if (item.key === 'sentRequests') {
      return (
        <View className="mb-5">
          <Text className="text-xl text-gray-dark font-bold mb-2">
            {item.title}
          </Text>
          <FlatList
            data={item.data as string[]}
            keyExtractor={(friend) => friend}
            renderItem={({ item }) => (
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-medium">{item}</Text>
                <TouchableOpacity
                  onPress={() => {
                    // Cancel request
                    // Remove email from sentRequests
                    setSections(
                      sections.map((section) => {
                        if (section.key === 'sentRequests') {
                          return {
                            ...section,
                            data: (section.data as string[]).filter(
                              (email) => email !== item,
                            ),
                          };
                        }
                        return section;
                      }),
                    );
                  }}
                >
                  <Text className="text-sm font-bold text-red-500">CANCEL</Text>
                </TouchableOpacity>
              </View>
            )}
            ItemSeparatorComponent={() => <View className="h-1" />}
            ListEmptyComponent={() => (
              <Text className="text-lg font-medium">No sent requests</Text>
            )}
          />
        </View>
      );
    } else if (item.key === 'incomingRequests') {
      return (
        <View className="mb-5">
          <Text className="text-xl text-gray-dark font-bold mb-2">
            {item.title}
          </Text>
          <FlatList
            data={item.data as User[]}
            keyExtractor={(friend) => friend.id}
            renderItem={({ item }) => (
              <IncomingRequestItem
                user={item}
                onAccept={() => {
                  // Accept request
                  // Remove user from incomingRequests and add to friends
                  setSections(
                    sections.map((section) => {
                      if (section.key === 'friends') {
                        return {
                          ...section,
                          data: [item, ...(section.data as User[])],
                        };
                      } else if (section.key === 'incomingRequests') {
                        return {
                          ...section,
                          data: (section.data as User[]).filter(
                            (user) => user.id !== item.id,
                          ),
                        };
                      }
                      return section;
                    }),
                  );
                }}
                onDeny={() => {
                  // Deny request
                  // Remove user from incomingRequests
                  setSections(
                    sections.map((section) => {
                      if (section.key === 'incomingRequests') {
                        return {
                          ...section,
                          data: (section.data as User[]).filter(
                            (user) => user.id !== item.id,
                          ),
                        };
                      }
                      return section;
                    }),
                  );
                }}
              />
            )}
            ItemSeparatorComponent={() => <View className="h-1" />}
            ListEmptyComponent={() => (
              <Text className="text-lg font-medium">No incoming requests</Text>
            )}
          />
        </View>
      );
    } else if (item.key === 'friends') {
      return (
        <View className="mb-5">
          <Text className="text-xl text-gray-dark font-bold mb-2">
            {item.title}
          </Text>
          <FlatList
            data={item.data as User[]}
            keyExtractor={(friend) => friend.id}
            renderItem={({ item }) => <FriendItem user={item} />}
            ItemSeparatorComponent={() => <View className="h-1" />}
            ListEmptyComponent={() => (
              <Text className="text-lg font-medium">No friends</Text>
            )}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView className="relative w-full flex-col justify-start items-start bg-off-white px-6">
      <FlatList
        data={sections}
        keyExtractor={(section) => section.key}
        renderItem={({ item }) => renderSection(item)}
        ListHeaderComponent={
          <Text className="text-2xl text-gray-black mb-5 w-full pt-6">
            Social
          </Text>
        }
        ListFooterComponent={<View className="pb-6" />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Social;

const IncomingRequestItem: React.FC<{
  user: User;
  onAccept: () => void;
  onDeny: () => void;
}> = ({ user, onAccept, onDeny }) => {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-lg font-medium">{user.profileInfo.username}</Text>
      <View className="flex-row justify-center items-center">
        <TouchableOpacity onPress={onAccept}>
          <Text className="text-sm font-bold mr-5 text-blue">ACCEPT</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDeny}>
          <Text className="text-sm font-bold text-red-500">DENY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FriendItem: React.FC<{ user: User }> = ({ user }) => {
  return (
    <View>
      <View className="flex-row justify-between items-end w-full">
        <Text className="text-lg font-medium">{user.profileInfo.username}</Text>
        {user.privacySettings.isLastWorkoutPublic ? (
          <Text className="text-xs font-medium">Last Workout: 3d ago</Text>
        ) : null}
      </View>
      {user.privacySettings.isCurrentQuestPublic ? (
        <Text className="font-medium text-xs">
          On Quest: <Text className="font-bold">Hunt Big Chungus</Text>
        </Text>
      ) : (
        <Text className="font-medium text-xs">-</Text>
      )}
    </View>
  );
};
