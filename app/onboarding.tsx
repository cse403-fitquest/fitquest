import { Text, View } from 'react-native';
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

      <Text>On average, how long are each of your workout sessions?</Text>
      <RadioGroup
        radioButtons={[
          {
            id: '1',
            label: '15-30 minutes',
            value: '0',
          },
          {
            id: '2',
            label: '30-60 minutes',
            value: '1',
          },
          {
            id: '3',
            label: '60-90 minutes',
            value: '2',
          },
          {
            id: '4',
            label: 'More than 90 minutes',
            value: '3',
          },
        ]}
        onPress={(data) => console.log(data)}
      />

      <Text>
        Question 3: How would you describe the intensity of your typical
        workouts?
      </Text>
      <RadioGroup
        radioButtons={[
          {
            id: '1',
            label: 'Light (casual walking)',
            value: '0',
          },
          {
            id: '2',
            label: 'Moderate (easy jogging)',
            value: '1',
          },
          {
            id: '3',
            label: 'Vigorous (fast cycling)',
            value: '2',
          },
          {
            id: '4',
            label: 'Intense (heavy powerlifting)',
            value: '3',
          },
        ]}
        onPress={(data) => console.log(data)}
      />

      <Text>Question 4: How long have you been regularly exercising?</Text>
      <RadioGroup
        radioButtons={[
          {
            id: '1',
            label: "I'm just starting out",
            value: '0',
          },
          {
            id: '2',
            label: 'Less than a year',
            value: '1',
          },
          {
            id: '3',
            label: '1-3 years',
            value: '2',
          },
          {
            id: '4',
            label: 'Over 3 years',
            value: '3',
          },
        ]}
        onPress={(data) => console.log(data)}
      />
      <Link href="/welcome">
        <Text>Return to Profile</Text>
      </Link>
    </View>
  );
}
