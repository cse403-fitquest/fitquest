import { FIREBASE_AUTH } from '@/firebaseConfig';
import { getUser } from '@/services/user';
import { useGeneralStore } from '@/store/general';
import { useUserStore } from '@/store/user';
import { useWorkoutStore } from '@/store/workout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Href, router, Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { setUser } = useUserStore();

  const { loading, setLoading } = useGeneralStore();

  const { setWorkout, clearWorkout } = useWorkoutStore();

  useEffect(() => {
    // Setup observer to reroute user based on auth state change
    onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        setLoading(true);

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

        // Get active workout from AsyncStorage if it exists
        const activeWorkoutString = await AsyncStorage.getItem('activeWorkout');

        if (activeWorkoutString) {
          setWorkout(() => {
            const activeWorkout = JSON.parse(
              activeWorkoutString,
              (key, value) => {
                if (key === 'startedAt') {
                  return new Date(value);
                }
                return value;
              },
            );

            return activeWorkout;
          });
        }

        console.log('Navigating to appropriate screen');

        setLoading(false);

        // Navigate to the appropriate screen
        if (userData.isOnboardingCompleted) {
          router.replace('/profile' as Href);
        } else {
          router.replace('/01-welcome' as Href);
        }
      } else {
        // User is signed out
        console.log('User is signed out');

        // Clear workout from async storage
        clearWorkout();

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
    <>
      {loading ? (
        <View className="absolute z-50 w-full h-full bg-black opacity-50 justify-center items-center">
          <ActivityIndicator size={100} color="white" />
          <StatusBar style="light" />
        </View>
      ) : null}
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(workout)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="allocate-points" options={{ headerShown: false }} />
        <Stack.Screen name="fight" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
