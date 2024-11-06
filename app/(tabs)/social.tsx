import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  PanResponder,
  Animated,
  Alert,
} from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Friend } from '@/types/social';
import { Ionicons } from '@expo/vector-icons';
import FQModal from '@/components/FQModal';
import FQTextInput from '@/components/FQTextInput';
import { isEmailValid } from '@/utils/auth';
import { useSocialStore } from '@/store/social';
import { getUserFriends, sendFriendRequest } from '@/services/social';
import { useUserStore } from '@/store/user';

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
    user: Friend | null;
    friend: Friend | null;
  }>({
    option: ModalDataOptions.ADD_FRIEND,
    email: '',
    user: null,
    friend: null,
  });
  const { user } = useUserStore();
  const { userFriend, setFriends, setPendingRequests, setSentRequests } =
    useSocialStore();

  // Fetch user friends
  useEffect(() => {
    const fetchUserFriends = async () => {
      console.log('Fetching user friends');

      if (!user?.id) {
        return;
      }

      // Fetch user friends
      const userFriendsResponse = await getUserFriends(user?.id);
      if (userFriendsResponse.success && userFriendsResponse.data) {
        setFriends(userFriendsResponse.data.friends);
        setPendingRequests(userFriendsResponse.data.pendingRequests);
        setSentRequests(userFriendsResponse.data.sentRequests);
      }
    };

    fetchUserFriends();
  }, []);

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

  const sections = useMemo(() => {
    if (!userFriend) {
      return [
        {
          key: 'sentRequests',
          title: 'SENT REQUESTS',
          data: [],
        },
        {
          key: 'pendingRequests',
          title: 'PENDING REQUESTS',
          data: [],
        },
        {
          key: 'friends',
          title: 'FRIENDS',
          data: [],
        },
      ];
    }

    return [
      {
        key: 'sentRequests',
        title: 'SENT REQUESTS',
        data: userFriend.sentRequests,
      },
      {
        key: 'pendingRequests',
        title: 'PENDING REQUESTS',
        data: userFriend.pendingRequests,
      },
      {
        key: 'friends',
        title: 'FRIENDS',
        data: userFriend.friends,
      },
    ];
  }, [userFriend]);

  const renderSection = (item: {
    key: string;
    title: string;
    data: Friend[] | string[];
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
              <View className="w-full flex-row justify-between items-center">
                <Text className="text-lg font-medium">{item}</Text>
                <TouchableOpacity
                  onPress={() => {
                    // TODO: Cancel request

                    // Cancel request
                    // Remove email from sentRequests
                    setSentRequests(
                      (
                        sections.find(
                          (section) => section.key === 'sentRequests',
                        )?.data as string[]
                      ).filter((email) => email !== item),
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
    } else if (item.key === 'pendingRequests') {
      return (
        <View className="mb-5">
          <Text className="text-xl text-gray-dark font-bold mb-2">
            {item.title}
          </Text>
          <FlatList
            data={item.data as Friend[]}
            keyExtractor={(friend) => friend.id}
            renderItem={({ item }) => (
              <IncomingRequestItem
                user={item}
                onAccept={() => {
                  // TODO: Accept request

                  // Accept request
                  // Remove user from pendingRequests and add to friends
                  setPendingRequests(
                    (
                      sections.find(
                        (section) => section.key === 'pendingRequests',
                      )?.data as Friend[]
                    ).filter((user) => user.id !== item.id),
                  );

                  setFriends([
                    item,
                    ...(sections.find((section) => section.key === 'friends')
                      ?.data as Friend[]),
                  ]);
                }}
                onDeny={() => {
                  // TODO: Deny request

                  // Deny request
                  // Remove user from pendingRequests
                  setPendingRequests(
                    (
                      sections.find(
                        (section) => section.key === 'pendingRequests',
                      )?.data as Friend[]
                    ).filter((user) => user.id !== item.id),
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
          <View className="w-full flex-row justify-between items-center">
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
            data={item.data as Friend[]}
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

  const handleModalConfirm = async () => {
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
        if (!isEmailValid(emailInput)) {
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

      // TODO: Send friend request
      if (!user?.id) {
        return;
      }

      const sendFriendRequestResponse = await sendFriendRequest(
        user?.id,
        emailInput,
      );

      if (!sendFriendRequestResponse.success) {
        // Handle error

        Alert.alert(
          'Error',
          sendFriendRequestResponse.error ?? 'Error sending friend request',
        );
        return;
      }

      // Add email to sent requests
      setSentRequests([...sentRequests, modalDataOption.email]);
    } else if (modalDataOption.option === ModalDataOptions.REMOVE_FRIEND) {
      // TODO: Remove friend

      // Remove friend
      // Remove user from friends
      setFriends(
        (
          sections.find((section) => section.key === 'friends')
            ?.data as Friend[]
        ).filter((user) => user.id !== modalDataOption.friend?.id),
      );
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="relative w-full h-full flex-col justify-start items-start bg-offWhite px-6">
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
        ListFooterComponent={<View className="h-[10px]" />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Social;

const IncomingRequestItem: React.FC<{
  user: Friend;
  onAccept: () => void;
  onDeny: () => void;
}> = ({ user, onAccept, onDeny }) => {
  return (
    <View className="w-full flex-row justify-between items-center">
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

const FriendItem: React.FC<{ user: Friend; onDelete: () => void }> = ({
  user,
  onDelete,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        if (Math.abs(gesture?.dx) > Math.abs(gesture?.dy)) {
          return true;
        }
        return false;
      },
      onPanResponderMove: (_, gestureState) => {
        if (Math.abs(gestureState?.dx) > Math.abs(gestureState?.dy)) {
          if (gestureState.dx < 0) {
            translateX.setValue(gestureState.dx);
          }
          return true;
        }
        return false;
      },
      onPanResponderRelease: (_, gestureState) => {
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
