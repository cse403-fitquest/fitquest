import { Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

export default function Welcome() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/*
      <Link href="/onboarding">
        <Pressable>
          <Text>Open Onboarding Wizard</Text>
        </Pressable>
      </Link>
      */}
      <Link href="/onboarding">
        <Text>Open Onboarding Wizard</Text>
      </Link>

      <Text>Welcome to the app!</Text>
    </View>
  );
}
