import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const ExerciseLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="workout-template"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit-workout-template"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="new-workout"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-exercises"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#F7F7F7" style="dark" />
    </>
  );
};

export default ExerciseLayout;
