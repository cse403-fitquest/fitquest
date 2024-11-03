import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { secondsToMinutes } from '@/utils/workout';

const Workout = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(
    null,
  );

  // to swap between starting and stopping workouts
  const toggleWorkout = () => {
    if (isWorkoutActive) {
      stopWorkout();
    } else {
      startWorkout();
    }
    //setIsWorkoutActive(!isWorkoutActive);
    console.log(isWorkoutActive ? 'workout ended, final time: '+secondsToMinutes(secondsElapsed) : 'workout started');
  };

  // when workout is started
  // TODO: DELETE LINE BELOW WHEN USING THE FUNCTION
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const startWorkout = () => {
    if (!isWorkoutActive) {
      setIsWorkoutActive(true);
      setSecondsElapsed(0); // Reset the timer whenever a new workout starts
      const newTimer = setInterval(() => {
        setSecondsElapsed((prevSeconds) => prevSeconds + 1);
      }, 1000);
      setTimer(newTimer); // Store the timer ID
    }
  };

  // when workout is stopped
  // TODO: DELETE LINE BELOW WHEN USING THE FUNCTION
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stopWorkout = () => {
    if (isWorkoutActive) {
      setIsWorkoutActive(false);
      if (timer) {
        clearInterval(timer); // Stop the timer
        setTimer(null); // Clear the timer ID
      }
    }
  };

  useEffect(() => {
    return () => {
      // Clear the timer when the component is unmounted
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  return (
    <SafeAreaView className="flex-1 items-left justify-left h-full bg-offWhite">
      <Text className="text-4xl text-black font-bold text-left" style = {{marginTop: 10, marginBottom: 10}}> Workout</Text>
      <SafeAreaView className="flex-1 items-left justify-r h-full">
        {/* Start/Stop Workout Button */}
        <TouchableOpacity
          onPress={toggleWorkout}
          style={{
            backgroundColor: isWorkoutActive ? 'red' : 'purple',
            width: 145,
            padding: 15,
            marginLeft: 5,
            marginTop: 0,
            borderRadius: 40,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>
            {isWorkoutActive ? 'Stop Workout' : 'Start Workout'}
          </Text>
        </TouchableOpacity>

        {/* Placeholder because linter does not accept unused values (secondsElapsed was previously unused) */}
        <Text style={{marginLeft: 12}}>Time Elapsed: {secondsToMinutes(secondsElapsed)}</Text>

        {/* Create Template Button */}
        <TouchableOpacity
          style={{
            backgroundColor: 'purple',
            width: 165,
            padding: 15,
            marginLeft: 5,
            marginTop: 15,
            borderRadius: 40,
          }}
          onPress={() => console.log('create template pressed')}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>Create Template</Text>
        </TouchableOpacity>

        {/* Saved Templates Section */}
        <View className="w-full mt-5 px-4">
          <Text className="text-2xl text-black">Saved Templates</Text>
        </View>

        {/* Suggested Templates Section */}
        <View className="w-full mt-5 px-4">
          <Text className="text-2xl text-black">Suggested Templates</Text>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default Workout;
