import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  PanResponder,
  Animated,
} from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserFriend } from '@/types/friend';
import { BASE_USER } from '@/constants/user';
import { User } from '@/types/auth';
import { Ionicons } from '@expo/vector-icons';
import FQModal from '@/components/FQModal';
import FQTextInput from '@/components/FQTextInput';

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

enum ModalDataOptions {
  ADD_FRIEND = 'ADD_FRIEND',
  REMOVE_FRIEND = 'REMOVE_FRIEND',
}

const Social = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDataOption, setModalDataOption] = useState<{
    option: ModalDataOptions;
    email: string;
    emailError?: string;
    user: User | null;
    friend: User | null;
  }>({
    option: ModalDataOptions.ADD_FRIEND,
    email: '',
    user: null,
    friend: null,
  });

  const modalData: {
    title: string;
    confirmButtonText: string;
    children: React.ReactNode;
  } = useMemo(() => {
    switch (modalDataOption.option) {
      case ModalDataOptions.ADD_FRIEND:
        return {
          title: 'Add Friend',
          confirmButtonText: 'ADD',
          children: (
            <View className="mt-5 w-[240px]">
              <FQTextInput
                onChangeText={(text) =>
                  setModalDataOption({ ...modalDataOption, email: text })
                }
                label="Email"
                value={modalDataOption.email}
                error={modalDataOption.emailError}
              />
            </View>
          ),
        };
      case ModalDataOptions.REMOVE_FRIEND:
        return {
          title: 'Remove Friend',
          confirmButtonText: 'REMOVE',
          children: (
            <Text className="text-lg font-medium">
              Are you sure you want to remove{' '}
              {modalDataOption.friend?.profileInfo.username}?
            </Text>
          ),
        };
      default:
        return {
          title: '',
          children: null,
          confirmButtonText: '',
        };
    }
  }, [modalDataOption]);

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
          <View className="flex-row justify-between items-center">
            <Text className="text-xl text-gray-dark font-bold mb-2">
              {item.title}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModalDataOption({
                  option: ModalDataOptions.ADD_FRIEND,
                  email: '',
                  user: null,
                  friend: null,
                });
                setModalVisible(true);
              }}
            >
              <Ionicons name="add" size={24} color="#00AEEF" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={item.data as User[]}
            keyExtractor={(friend) => friend.id}
            renderItem={({ item }) => (
              <FriendItem
                user={item}
                onDelete={() => {
                  // Open modal to confirm removal

                  setModalDataOption({
                    option: ModalDataOptions.REMOVE_FRIEND,
                    email: '',
                    user: item,
                    friend: item,
                  });
                  setModalVisible(true);
                }}
              />
            )}
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

  const handleModalConfirm = () => {
    if (modalDataOption.option === ModalDataOptions.ADD_FRIEND) {
      // Send friend request
      // Add email to sentRequests

      // Handle errors
      let emailError: string = '';
      const emailInput = modalDataOption.email.trim();

      // Validate email
      // Email validation
      // Check if email input is empty
      if (!emailInput) {
        emailError = 'Email is required';
      }

      // Check for email regex
      // If email is not empty, check if it's a valid email
      if (!emailError) {
        // Email regex used from https://emailregex.com/
        const emailRegex =
          // eslint-disable-next-line no-control-regex
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (!emailRegex.test(emailInput)) {
          emailError = 'Must be a valid email address';
        }
      }

      // Check if email is already in sent requests
      const sentRequests = sections.find(
        (section) => section.key === 'sentRequests',
      )?.data as string[];
      if (sentRequests.includes(modalDataOption.email)) {
        emailError = 'Request already sent';
      }

      if (emailError) {
        // Handle email error
        setModalDataOption({
          ...modalDataOption,
          emailError,
        });
        return;
      }

      setSections(
        sections.map((section) => {
          if (section.key === 'sentRequests') {
            return {
              ...section,
              data: [...(section.data as string[]), modalDataOption.email],
            };
          }
          return section;
        }),
      );
    } else if (modalDataOption.option === ModalDataOptions.REMOVE_FRIEND) {
      // Remove friend
      // Remove user from friends
      setSections(
        sections.map((section) => {
          if (section.key === 'friends') {
            return {
              ...section,
              data: (section.data as User[]).filter(
                (user) => user.id !== modalDataOption.friend?.id,
              ),
            };
          }
          return section;
        }),
      );
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="relative w-full flex-col justify-start items-start bg-offWhite px-6">
      <FQModal
        visible={modalVisible}
        setVisible={setModalVisible}
        title={modalData.title}
        onConfirm={() => handleModalConfirm()}
        confirmText={modalData.confirmButtonText}
        cancelText="CANCEL"
      >
        {modalData.children}
      </FQModal>
      <FlatList
        data={sections}
        keyExtractor={(section) => section.key}
        renderItem={({ item }) => renderSection(item)}
        ListHeaderComponent={
          <Text className="text-2xl text-black mb-5 w-full pt-6">Social</Text>
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

const FriendItem: React.FC<{ user: User; onDelete: () => void }> = ({
  user,
  onDelete,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        console.log(gestureState.dx);
        if (gestureState.dx < -100) {
          Animated.spring(translateX, {
            toValue: -100,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View className="relative">
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: translateX }],
        }}
      >
        <View {...panResponder.panHandlers} className=" z-10">
          <View className="flex-row justify-between items-end w-full">
            <Text className="text-lg font-medium">
              {user.profileInfo.username}
            </Text>
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
        <TouchableOpacity
          onPress={onDelete}
          className="absolute right-[-100px] h-full justify-center items-center bg-red-500 w-[90px]"
        >
          <Text className="text-white font-bold">DELETE</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
