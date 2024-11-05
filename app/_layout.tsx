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
        setUser(getUserResponse.data.user);

        // User is signed in
        console.log(
          'User is signed in as username:',
          getUserResponse.data.user.profileInfo.username,
        );

        // Navigate to the appropriate screen
        router.replace('/profile' as Href);
      } else {
        // User is signed out
        console.log('User is signed out');

        // Clear user data
        setUser(null);

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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
