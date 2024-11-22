import { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const NewWorkout = () => {
  const [workoutName, setWorkoutName] = useState('Empty Workout');
  let tempWorkoutName = workoutName;

  const turnDateIntoString = (date: Date) => {
    const dayIndex = date.getDay();
    let day = 'Sunday';
    switch (dayIndex) {
      case 0:
        day = 'Sunday';
        break;
      case 1:
        day = 'Monday';
        break;
      case 2:
        day = 'Tuesday';
        break;
      case 3:
        day = 'Wednesday';
        break;
      case 4:
        day = 'Thursday';
        break;
      case 5:
        day = 'Friday';
        break;
      case 6:
        day = 'Saturday';
        break;
    }

    const monthIndex = date.getMonth();
    let month = 'January';
    switch (monthIndex) {
      case 0:
        month = 'January';
        break;
      case 1:
        month = 'February';
        break;
      case 2:
        month = 'March';
        break;
      case 3:
        month = 'April';
        break;
      case 4:
        month = 'May';
        break;
      case 5:
        month = 'June';
        break;
      case 6:
        month = 'July';
        break;
      case 7:
        month = 'August';
        break;
      case 8:
        month = 'September';
        break;
      case 9:
        month = 'October';
        break;
      case 10:
        month = 'November';
        break;
      case 11:
        month = 'December';
        break;
    }

    return `${day}, ${month} ${date.getDate()}, ${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <SafeAreaView className="relative w-full h-full justify-start items-start bg-offWhite">
      <FlatList
        data={[]}
        renderItem={() => null}
        style={{ width: '100%' }}
        ListHeaderComponent={() => (
          <View className="relative w-full justify-start items-start px-6 py-8">
            <View className="w-full flex-row justify-end mb-2">
              <TouchableOpacity>
                <Text className="text-blue text-lg font-semibold">FINISH</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              className="w-full text-lg font-semibold mb-2"
              onChangeText={(text) => (tempWorkoutName = text)}
              onEndEditing={() => setWorkoutName(tempWorkoutName)}
              onBlur={() => setWorkoutName(tempWorkoutName)}
              defaultValue={workoutName}
            />
            <Text className="text-grayDark text-sm">
              {turnDateIntoString(new Date())}
            </Text>

            {/* Exercises here */}

            <FlatList
              data={[]}
              renderItem={() => null}
              ListEmptyComponent={() => <View className="h-24" />}
            />

            <View className="w-full justify-center items-center">
              <TouchableOpacity className="mb-5">
                <Text className="text-blue text-lg font-semibold ">
                  ADD EXERCISE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-red-500 text-lg font-semibold">
                  CANCEL WORKOUT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default NewWorkout;
