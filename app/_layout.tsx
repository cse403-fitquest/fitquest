import { BASE_USER } from '@/constants/user';
import { FIREBASE_AUTH } from '@/firebaseConfig';
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
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        console.log('User is signed in', user.uid);
        // console.log(user);

        setUser({
          ...BASE_USER,
          id: user.uid,
        });

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
