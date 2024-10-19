import { Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Workout = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center h-full bg-off-white">
      <Text className="text-3xl text-black">Workout</Text>
    </SafeAreaView>
  );
};

export default Workout;
