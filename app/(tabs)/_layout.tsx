import { Href, Redirect, Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '@/store/user';
import { useEffect } from 'react';
import { fetchItems, setItemsInDB } from '@/services/item';
import { useItemStore } from '@/store/item';
import { Alert } from 'react-native';
import { MOCK_SHOP_ITEMS } from '@/constants/shop';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { user } = useUserStore();
  const { setItems } = useItemStore();

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
      const setShopItemsResponse = await setItemsInDB(MOCK_SHOP_ITEMS);

      if (!setShopItemsResponse.success) {
        if (setShopItemsResponse.error)
          Alert.alert('Error', setShopItemsResponse.error);
      } else {
        fetchItemsData();
      }
    };

    fetchItemsData();
  }, []);

  return (
    <>
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
                name={focused ? 'help' : 'help-outline'}
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
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}
