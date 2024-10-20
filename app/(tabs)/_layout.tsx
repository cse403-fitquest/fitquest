import { Href, Redirect, Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { isLoggedIn } from '@/utils/auth';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  if (!isLoggedIn()) return <Redirect href={'/sign-in' as Href} />;

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
          name="sign-out"
          options={{
            title: 'Sign Out',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'body' : 'body-outline'}
                color={color}
                size={20}
              />
            ),
          }}
        />

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

        {/* <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'code-slash' : 'code-slash-outline'}
              color={color}
            />
          ),
        }}
      /> */}
      </Tabs>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}
