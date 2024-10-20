import { Text, useColorScheme } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

const Shop = () => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      className={`flex-1 items-center justify-center h-full`}
      style={{
        backgroundColor: Colors[colorScheme ?? 'dark'].background,
      }}
    >
      <Text
        className="text-3xl"
        style={{
          color: Colors[colorScheme ?? 'dark'].text,
        }}
      >
        Shop Hi World
      </Text>
    </SafeAreaView>
  );
};

export default Shop;
