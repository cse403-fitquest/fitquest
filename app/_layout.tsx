import { FIREBASE_AUTH } from '@/firebaseConfig';
import { getUser } from '@/services/user';
import { useUserStore } from '@/store/user';
import { useFonts } from 'expo-font';
import { Href, router, Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { setUser } = useUserStore();

  useEffect(() => {
    // Setup observer to reroute user based on auth state change
    onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        // Get user data from Firestore
        const getUserResponse = await getUser(user.uid);

        if (!getUserResponse.success || !getUserResponse.data) {
          console.error('Error fetching user data');
          return;
        }

        // Set user data
        const userData = getUserResponse.data.user;
        setUser(userData);

        // User is signed in
        console.log(
          'User is signed in as username:',
          userData.profileInfo.username,
        );

        // Navigate to the appropriate screen
        if (userData.isOnboardingCompleted) {
          router.replace('/new-workout' as Href);
        } else {
          router.replace('/01-welcome' as Href);
        }
      } else {
        // User is signed out
        console.log('User is signed out');

        console.log('Navigating to sign-in screen');
        // Navigate to the appropriate screen
        router.replace('/sign-in' as Href);
      }
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <Slot />;
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(exercise)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="allocate-points" options={{ headerShown: false }} />
      <Stack.Screen name="fight" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
