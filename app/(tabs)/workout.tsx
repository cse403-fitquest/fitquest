import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const buttonStr = 'Start Workout';

const Workout = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  
  {/*to swap between starting and stopping workouts*/}
  const toggleWorkout = () => {
    setIsWorkoutActive(!isWorkoutActive);
    console.log(isWorkoutActive ? 'workout ended' : 'workout started');
  };

  {/*when workout is started*/}
  const startWorkout = () => {
      if (!isWorkoutActive) {
        setIsWorkoutActive(true);
        setSecondsElapsed(0); // Reset the timer whenever a new workout starts
        const newTimer = setInterval(() => {
          setSecondsElapsed((prevSeconds) => prevSeconds + 1);
        }, 1000);
        setTimer(newTimer); // Store the timer ID
      }
    }
  
    {/*when workout is stopped*/}
    const stopWorkout = () => {
      if (isWorkoutActive) {
        setIsWorkoutActive(false);
        if (timer ) {
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
    <SafeAreaView className="flex-1 items-center justify-center h-full bg-off-white">
      <Text className="text-3xl text-black">Workout</Text>
      <SafeAreaView className="flex-1 items-center justify-center h-full">


        {/* Start/Stop Workout Button */}
        <TouchableOpacity
          onPress={toggleWorkout}
          style={{
            backgroundColor: isWorkoutActive ? 'red' : 'green',
            padding: 10,
            marginTop: 20,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>
            {isWorkoutActive ? 'Stop Workout' : 'Start Workout'}
          </Text>
        </TouchableOpacity>


        {/* Create Template Button */}
        <TouchableOpacity
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
            borderRadius: 5,
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
