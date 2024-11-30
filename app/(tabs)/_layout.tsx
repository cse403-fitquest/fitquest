import { Href, Redirect, Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '@/store/user';
import { useEffect } from 'react';
import { fetchItems, setItemsInDB } from '@/services/item';
import { useItemStore } from '@/store/item';
import { Alert, View } from 'react-native';
import { MOCK_ITEMS } from '@/constants/item';
import { useSocialStore } from '@/store/social';
import { getUserFriends } from '@/services/social';
import { getUserExpThreshold } from '@/utils/user';
import { fillMissingUserFields, updateAllUsersInDB } from '@/services/user';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { user } = useUserStore();
  const { setItems } = useItemStore();
  const { setFriends, setPendingRequests, setSentRequests } = useSocialStore();

  if (!user) return <Redirect href={'/sign-in' as Href} />;

  // Upon being logged in, fetch the app data
  // Items, quests, etc.
  useEffect(() => {
    // Fetch items
    const fetchItemsData = async () => {
      const getShopItemsResponse = await fetchItems();

      if (getShopItemsResponse.success) {
        setItems(getShopItemsResponse.data);
      } else {
        if (getShopItemsResponse.error)
          Alert.alert('Error', getShopItemsResponse.error);
      }
    };

    // Set shop items in DB (for testing)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _setItemsData = async () => {
      const setShopItemsResponse = await setItemsInDB(MOCK_ITEMS);

      if (!setShopItemsResponse.success) {
        if (setShopItemsResponse.error)
          Alert.alert('Error', setShopItemsResponse.error);
      } else {
        fetchItemsData();
      }
    };

    // Fill missing user fields in DB (for testing)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _setUserMissingFields = async () => {
      console.log('Filling missing user fields');
      const fillMissingUserFieldsResponse = await fillMissingUserFields();

      if (!fillMissingUserFieldsResponse.success) {
        if (fillMissingUserFieldsResponse.error)
          Alert.alert('Error', fillMissingUserFieldsResponse.error);
      }
    };

    // Set all user fields in DB (for testing)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _setUserFields = async () => {
      console.log('Setting user fields in DB');
      const setUserFieldsResponse = await updateAllUsersInDB();

      if (!setUserFieldsResponse.success) {
        if (setUserFieldsResponse.error)
          Alert.alert('Error', setUserFieldsResponse.error);
      }
    };

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

    // _setItemsData();
    // _setUserFields();
    // fillMissingUserFields();
    fetchItemsData();
    fetchUserFriends();
  }, []);

  return (
    <>
      <View
        className="absolute z-10 bottom-[58px] left-0 bg-yellow h-[5px] bg-purple"
        style={{ width: '100%' }}
      >
        <View
          className="h-full bg-yellow"
          style={{
            width: `${(user.exp / getUserExpThreshold(user)) * 100}%`,
          }}
        />
      </View>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor:
            Colors[colorScheme ?? 'light'].tabBarActiveTintColor,
          tabBarInactiveTintColor:
            Colors[colorScheme ?? 'light'].tabBarInactiveTintColor,
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 5,
            height: 60,
            backgroundColor:
              Colors[colorScheme ?? 'light'].tabBarBackgroundColor,
          },
        }}
      >
        {/* Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'body' : 'body-outline'}
                color={color}
                size={20}
              />
            ),
          }}
        />

        {/* Workout */}
        <Tabs.Screen
          name="workout"
          options={{
            title: 'Workout',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'barbell' : 'barbell-outline'}
                color={color}
                size={25}
              />
            ),
          }}
        />

        {/* Quest */}
        <Tabs.Screen
          name="quest"
          options={{
            title: 'Quest',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'alert-outline' : 'alert-outline'}
                color={color}
                size={27}
              />
            ),
          }}
        />

        {/* Shop */}
        <Tabs.Screen
          name="shop"
          options={{
            title: 'Shop',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'cart' : 'cart-outline'}
                color={color}
                size={25}
              />
            ),
          }}
        />

        {/* Social */}
        <Tabs.Screen
          name="social"
          options={{
            title: 'Social',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'people' : 'people-outline'}
                color={color}
                size={20}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#F7F7F7" style="dark" />
    </>
  );
}
