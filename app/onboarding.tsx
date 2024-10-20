import { Text, View, Pressable } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { RadioGroup } from 'react-native-radio-buttons-group';

/* Onboarding Wizard
 * This component will be used to guide the user through a series of questions to set up their profile.
 * The user will be asked to select from a series of multiple choice options.
 * Each response contributes to a final score which determines the user's starting stats.
 */
export default function Onboarding() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Onboarding Wizard</Text>
      {/* Multiple choice menus in the form of radio buttons */}
      <Text>
        Question 1: How often do you engage in physical exercise each week?
      </Text>
      <RadioGroup
        radioButtons={[
          {
            id: '1',
            label: 'I am not currently exercising',
            value: '0',
          },
          {
            id: '2',
            label: '1-2 times per week',
            value: '1',
          },
          {
            id: '3',
            label: '3-4 times per week',
            value: '2',
          },
          {
            id: '4',
            label: '5+ times per week',
            value: '3',
          },
        ]}
        onPress={(data) => console.log(data)}
      />
      <Link href="/welcome">
        <Pressable>
          <Text>Return to Profile</Text>
        </Pressable>
      </Link>
    </View>
  );
}
