import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
const buttonStr = 'Start Workout';

const Workout = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center h-full bg-off-white">
      <Text className="text-3xl text-black">Workout</Text>
      <SafeAreaView className={`flex-1 items-center justify-center h-full`}>
        <TouchableOpacity
          onPress={() => {
            console.log('workout ended');
          }}
          style={{
            backgroundColor: 'red',
            padding: 10,
            marginTop: 20,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>{buttonStr}</Text>
        </TouchableOpacity>
        <Text className="text-3xl text-black">Create Template</Text>
        <Text className="text-3xl text-black">My Templates</Text>
        <Text className="text-3xl text-black">Example Templates</Text>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default Workout;
