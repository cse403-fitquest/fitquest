import { Text, TouchableOpacity, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
const buttonStr = "Start Workout"

const Workout = () => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      className={`flex-1 items-center justify-center h-full`}
      style={{
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
    >
    <TouchableOpacity
    onPress={()=>{
      console.log("workout ended");
    }}
    style={{
      backgroundColor: 'red',
      padding: 10,
      marginTop: 20,
      borderRadius: 5,
    }}
  >
    <Text style={{ color: 'white', fontSize: 18 } }>{buttonStr}</Text>
  </TouchableOpacity>
      <Text
        className="text-3xl"
        style={{
          color: Colors[colorScheme ?? 'light'].text,
        }}
      >
        Create Template
      </Text>
      <Text
        className="text-3xl"
        style={{
          color: Colors[colorScheme ?? 'light'].text,
        }}
      >
        My Templates
      </Text>
      <Text
        className="text-3xl"
        style={{
          color: Colors[colorScheme ?? 'light'].text,
        }}
      >
        Example Templates
      </Text>
    </SafeAreaView>
    
  );
};

export default Workout;
