import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  PanResponder,
  Animated,
  Alert,
  RefreshControl,
} from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Friend, FriendRequest } from '@/types/social';
import { Ionicons } from '@expo/vector-icons';
import FQModal from '@/components/FQModal';
import FQTextInput from '@/components/FQTextInput';
import { useSocialStore } from '@/store/social';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  denyFriendRequest,
  getUserFriends,
  removeFriend,
  sendFriendRequest,
} from '@/services/social';
import { useUserStore } from '@/store/user';
import { useGeneralStore } from '@/store/general';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { SpriteState } from '@/constants/sprite';

enum ModalDataOptions {
  ADD_FRIEND = 'ADD_FRIEND',
  REMOVE_FRIEND = 'REMOVE_FRIEND',
}

const Social = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDataOption, setModalDataOption] = useState<{
    option: ModalDataOptions;
    username: string;
    usernameError?: string;
    user: Friend | null;
    friend: Friend | null;
  }>({
    option: ModalDataOptions.ADD_FRIEND,
    username: '',
    user: null,
    friend: null,
  });
  const { loading, setLoading } = useGeneralStore();
  const { user } = useUserStore();
  const { userFriend, setFriends, setPendingRequests, setSentRequests } =
    useSocialStore();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    console.log('Refreshing friends list');
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

    setRefreshing(false);
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
                  setModalDataOption({ ...modalDataOption, username: text })
                }
                label="Email"
                value={modalDataOption.username}
                error={modalDataOption.usernameError}
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

  const handleAcceptFriendRequest = async (friend: FriendRequest) => {
    // Accept request
    // Remove user from pendingRequests and add to friends

    if (!user?.id || loading) {
      return;
    }

    setLoading(true);

    const oldPendingRequests = sections.find(
      (section) => section.key === 'pendingRequests',
    )?.data as FriendRequest[];

    const oldFriends = sections.find((section) => section.key === 'friends')
      ?.data as Friend[];

    // Accept request
    // Remove user from pendingRequests and add to friends
    setPendingRequests(
      (
        sections.find((section) => section.key === 'pendingRequests')
          ?.data as FriendRequest[]
      ).filter((user) => user.id !== friend.id),
    );

    // setFriends([
    //   friend,
    //   ...(sections.find((section) => section.key === 'friends')
    //     ?.data as Friend[]),
    // ]);

    const acceptFriendRequestResponse = await acceptFriendRequest(
      friend.id,
      user?.id,
    );

    setLoading(false);

    if (
      !acceptFriendRequestResponse.success ||
      !acceptFriendRequestResponse.data
    ) {
      // Handle error

      Alert.alert(
        'Error',
        acceptFriendRequestResponse.error ?? 'Error accepting friend request',
      );

      // Revert changes
      setPendingRequests(oldPendingRequests);
      setFriends(oldFriends);
      return;
    }

    setFriends([
      acceptFriendRequestResponse.data,
      ...(sections.find((section) => section.key === 'friends')
        ?.data as Friend[]),
    ]);
  };

  const handleDenyFriendRequest = async (friend: FriendRequest) => {
    // Deny request
    // Remove user from pendingRequests
    if (!user?.id || loading) {
      return;
    }

    setLoading(true);

    const oldPendingRequests = sections.find(
      (section) => section.key === 'pendingRequests',
    )?.data as FriendRequest[];

    setPendingRequests(
      (
        sections.find((section) => section.key === 'pendingRequests')
          ?.data as FriendRequest[]
      ).filter((user) => user.id !== friend.id),
    );

    const denyFriendRequestResponse = await denyFriendRequest(
      friend.id,
      user?.id,
    );

    setLoading(false);

    if (!denyFriendRequestResponse.success) {
      // Handle error

      Alert.alert(
        'Error',
        denyFriendRequestResponse.error ?? 'Error denying friend request',
      );

      // Revert changes
      setPendingRequests(oldPendingRequests);
      return;
    }
  };

  const handleCancelFriendRequest = async (sentRequestUserID: string) => {
    // Cancel request
    // Remove user from sentRequests

    if (!user?.id || loading) {
      return;
    }

    setLoading(true);

    const cancelSentRequestResponse = await cancelFriendRequest(
      user?.id,
      sentRequestUserID,
    );

    setLoading(false);

    if (!cancelSentRequestResponse.success) {
      // Handle error

      Alert.alert(
        'Error',
        cancelSentRequestResponse.error ?? 'Error cancelling friend request',
      );
      return;
    }

    setSentRequests(
      (
        sections.find((section) => section.key === 'sentRequests')
          ?.data as FriendRequest[]
      ).filter((user) => user.id !== sentRequestUserID),
    );
  };

  const renderSection = (item: {
    key: string;
    title: string;
    data: Friend[] | FriendRequest[];
  }) => {
    if (item.key === 'sentRequests') {
      return (
        <View className="mb-5">
          <Text className="text-xl text-grayDark font-bold mb-2">
            {item.title}
          </Text>
          <FlatList
            data={item.data as FriendRequest[]}
            keyExtractor={(friend) => friend.id}
            renderItem={({ item }) => (
              <View className="w-full flex-row justify-between items-center">
                <Text className="text-lg font-medium">{item.username}</Text>
                <TouchableOpacity
                  onPress={() => handleCancelFriendRequest(item.id)}
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
          <Text className="text-xl text-grayDark font-bold mb-2">
            {item.title}
          </Text>
          <FlatList
            data={item.data as FriendRequest[]}
            keyExtractor={(friend) => friend.id}
            renderItem={({ item }) => (
              <IncomingRequestItem
                user={item}
                onAccept={() => handleAcceptFriendRequest(item)}
                onDeny={() => handleDenyFriendRequest(item)}
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
            <Text className="text-xl text-grayDark font-bold mb-2">
              {item.title}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModalDataOption({
                  option: ModalDataOptions.ADD_FRIEND,
                  username: '',
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
                    username: '',
                    user: item,
                    friend: item,
                  });
                  setModalVisible(true);
                }}
              />
            )}
            ItemSeparatorComponent={() => <View className="h-2" />}
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
    if (loading) return;

    if (modalDataOption.option === ModalDataOptions.ADD_FRIEND) {
      // Send friend request
      // Add email to sentRequests

      // Handle errors
      let usernameError: string = '';
      const usernameInput = modalDataOption.username.trim();

      // Validate username
      // Check if email input is empty
      if (!usernameInput) {
        usernameError = 'Username cannot be empty';
      }

      if (usernameError) {
        // Handle email error
        setModalDataOption({
          ...modalDataOption,
          usernameError,
        });
        return;
      }

      if (user?.profileInfo.username === usernameInput) {
        // Handle error

        Alert.alert('Error', 'Cannot add yourself as a friend');
        return;
      }

      if (!user?.id) {
        return;
      }

      setLoading(true);

      // first send the request, then update the UI
      const sendFriendRequestResponse = await sendFriendRequest(
        user?.id,
        usernameInput,
      );

      setLoading(false);

      if (!sendFriendRequestResponse.success) {
        // Handle error

        Alert.alert(
          'Error',
          sendFriendRequestResponse.error ?? 'Error sending friend request',
        );

        return;
      }

      // Add FriendRequest to sent requests
      setSentRequests([
        ...(sections.find((section) => section.key === 'sentRequests')
          ?.data as FriendRequest[]),
        sendFriendRequestResponse.data as FriendRequest,
      ]);
      setModalVisible(false);

      // Add email to sent requests
    } else if (modalDataOption.option === ModalDataOptions.REMOVE_FRIEND) {
      // Remove friend
      // Remove user from friends

      if (!user?.id || !modalDataOption.friend?.id) {
        return;
      }

      setLoading(true);

      const oldFriends = sections.find((section) => section.key === 'friends')
        ?.data as Friend[];

      setFriends(
        (
          sections.find((section) => section.key === 'friends')
            ?.data as Friend[]
        ).filter((user) => user.id !== modalDataOption.friend?.id),
      );

      setModalVisible(false);

      const removeFriendResponse = await removeFriend(
        user?.id,
        modalDataOption.friend?.id,
      );

      setLoading(false);

      if (!removeFriendResponse.success) {
        // Handle error

        Alert.alert(
          'Error',
          removeFriendResponse.error ?? 'Error removing friend',
        );

        // Revert changes
        setFriends(oldFriends);
        return;
      }
    }
  };

  return (
    <SafeAreaView className="relative w-full h-full flex-col justify-start items-start bg-offWhite px-6 py-8">
      <FQModal
        visible={modalVisible}
        setVisible={setModalVisible}
        title={modalData.title}
        onConfirm={() => handleModalConfirm()}
        confirmText={modalData.confirmButtonText}
        cancelText="CANCEL"
        loading={loading}
      >
        {modalData.children}
      </FQModal>
      <FlatList
        data={sections}
        keyExtractor={(section) => section.key}
        renderItem={({ item }) => renderSection(item)}
        ListHeaderComponent={
          <Text className="text-2xl text-black mb-5 w-full">Social</Text>
        }
        ListFooterComponent={<View className="h-[10px]" />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Social;

const IncomingRequestItem: React.FC<{
  user: FriendRequest;
  onAccept: () => void;
  onDeny: () => void;
}> = ({ user, onAccept, onDeny }) => {
  return (
    <View className="w-full flex-row justify-between items-center">
      <Text className="text-lg font-medium">{user.username}</Text>
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

  // Display last workout date in the format of
  // "2 days ago"
  //  or "1 day ago"
  //  or "1 week ago"
  //  or "1 month ago"
  // or "1 year ago"
  const displayLastWorkoutDate = (date: Date) => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.ceil(diffDays / 7);
    const diffMonths = Math.ceil(diffDays / 30);
    const diffYears = Math.ceil(diffDays / 365);

    if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffWeeks === 1) {
      return '1 week ago';
    } else if (diffWeeks < 4) {
      return `${diffWeeks} weeks ago`;
    } else if (diffMonths === 1) {
      return '1 month ago';
    } else if (diffMonths < 12) {
      return `${diffMonths} months ago`;
    } else if (diffYears === 1) {
      return '1 year ago';
    } else {
      return `${diffYears} years ago`;
    }
  };

  return (
    <View className="relative">
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: translateX }],
        }}
      >
        <View
          {...panResponder.panHandlers}
          className="relative flex-row justify-start items-center z-10 w-full h-[60px]"
        >
          <View className="w-[60px] h-[50px] relative">
            <View className="absolute top-[-22px] left-[-10px]">
              <AnimatedSprite
                id={user.spriteID}
                state={SpriteState.IDLE}
                width={70}
                height={70}
              />
            </View>
          </View>

          <View className="relative flex-1">
            <View className="flex-row justify-between">
              <Text className="text-lg font-medium">
                {user.profileInfo.username}
              </Text>
              {user.privacySettings.isLastWorkoutPublic ? (
                <Text className="text-xs float-right font-medium">
                  Last Workout:{' '}
                  {user.lastWorkoutDate
                    ? displayLastWorkoutDate(user.lastWorkoutDate)
                    : '-'}
                </Text>
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
