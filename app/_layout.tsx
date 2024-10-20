import { FIREBASE_AUTH } from '@/firebaseConfig';
import { useFonts } from 'expo-font';
import { Href, Slot, Stack, router } from 'expo-router';
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

  useEffect(() => {
    // Check user session and navigate to the appropriate screen

    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        console.log('User is signed in');
        console.log(user);

        // Navigate to the appropriate screen
        router.replace('/logout' as Href);
      } else {
        // User is signed out
        console.log('User is signed out');

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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
