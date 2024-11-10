import { useUserStore } from '@/store/user';
import { Href, Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const OnboardingLayout = () => {
  const { user } = useUserStore();

  if (!user) return <Redirect href={'/sign-in' as Href} />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="01-welcome"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="02-before-begin"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="03-frequency"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="04-length"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="05-intensity"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="06-experience"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="07-fitness-level"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="08-allocate-points"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default OnboardingLayout;
