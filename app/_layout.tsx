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
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { user, setUser } = useUserStore();

  const { loading, setLoading, sound, setSound } = useGeneralStore();

  const { setWorkout, clearWorkout } = useWorkoutStore();

  const [songFinished, setSongFinished] = useState(false);

  const onPlaybackStatusUpdate: ((status: AVPlaybackStatus) => void) | null = (
    status,
  ) => {
    // console.log('Playback status:', status);
    // console.log('Sound:', sound);
    const realStatus = status as AVPlaybackStatusSuccess;
    console.log('status:', realStatus);
    if (realStatus && realStatus.didJustFinish) {
      console.log('Song finished');
      setSongFinished(true);
    }
  };

  // Play auth theme song
  const playAuthBGM = async () => {
    const { sound: newSound } = await Audio.Sound.createAsync(
      require('@/assets/songs/bgm_auth_screens.mp3'),
    );

    await newSound.setPositionAsync(120000);

    newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    // await newSound.setIsLoopingAsync(true);

    setSound(newSound);

    await newSound.playAsync();
  };

  // Play logged in theme song
  const playLoggedInBGM = async () => {
    const { sound: newSound } = await Audio.Sound.createAsync(
      require('@/assets/songs/bgm_tab_screens.mp3'),
    );

    await newSound.setPositionAsync(95000);

    newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    // await newSound.setIsLoopingAsync(true);

    setSound(newSound);

    await newSound.playAsync();
  };

  console.log('sound:', sound);

  useEffect(() => {
    const replaySong = async () => {
      console.log('songFinished:', songFinished);
      console.log('sound:', !!sound);
      if (songFinished) {
        if (sound) {
          console.log('Replaying sound');
          if (user) {
            await playLoggedInBGM();
          } else {
            await playAuthBGM();
          }
        }
        setSongFinished(false);
      }
    };
    replaySong();
  }, [songFinished, sound]);

  useEffect(() => {
    // Unload and loop the sound
    // if (sound) {
    //   sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    //   sound.setPositionAsync(0);
    //   sound.playAsync();
    // }

    return () => {
      if (sound) {
        console.log('Unloading sound');
        // Unload sound when component unmounts
        sound.unloadAsync();
        setSound(null);
      }
    };
  }, [sound]);

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

        // Turn off auth theme song
        if (sound) {
          await sound.unloadAsync();
        }

        // Play logged in theme song
        await playLoggedInBGM();

        // Navigate to the appropriate screen
        if (userData.isOnboardingCompleted) {
          router.replace('/profile' as Href);
        } else {
          router.replace('/01-welcome' as Href);
        }
      } else {
        // Turn off logged in theme song
        if (sound) {
          await sound.unloadAsync();
        }

        // Play auth theme song
        playAuthBGM();

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
