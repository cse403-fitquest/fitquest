import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const enum ExerciseTag {
  WEIGHT = 'WEIGHT',
  REPS = 'REPS',
  DISTANCE = 'DISTANCE',
  TIME = 'TIME',
}

type ExerciseSet = {
  weight: number;
  reps: number;
  distance: number;
  time: number;
};

type Exercise = {
  name: string;
  tags: ExerciseTag[];
  sets: ExerciseSet[];
};

const EXERCISES_STUB: Exercise[] = [
  {
    name: 'Bench Press',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [
      {
        weight: 100,
        reps: 10,
        distance: 0,
        time: 0,
      },
      {
        weight: 100,
        reps: 10,
        distance: 0,
        time: 0,
      },
    ],
  },
  {
    name: 'Jogging',
    tags: [ExerciseTag.DISTANCE, ExerciseTag.TIME],
    sets: [
      {
        weight: 0,
        reps: 0,
        distance: 5,
        time: 30,
      },
      {
        weight: 0,
        reps: 0,
        distance: 5,
        time: 30,
      },
    ],
  },
];

const SET_COLUMN_WIDTH = 30;
const PREVIOUS_COLUMN_WIDTH = 68;

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

  const turnTagIntoString = (tag: ExerciseTag) => {
    switch (tag) {
      case ExerciseTag.WEIGHT:
        return 'WEIGHT';
      case ExerciseTag.REPS:
        return 'REPS';
      case ExerciseTag.DISTANCE:
        return 'DISTANCE';
      case ExerciseTag.TIME:
        return 'TIME';
    }
  };

  const getTagColumnWidth = (tag: ExerciseTag) => {
    switch (tag) {
      case ExerciseTag.WEIGHT:
        return 53;
      case ExerciseTag.REPS:
        return 50;
      case ExerciseTag.DISTANCE:
        return 66;
      case ExerciseTag.TIME:
        return 60;
      default:
        return 53;
    }
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
            <Text className="text-grayDark text-sm mb-8">
              {turnDateIntoString(new Date())}
            </Text>

            {/* Exercises here */}
            <FlatList
              data={EXERCISES_STUB}
              style={{ width: '100%' }}
              renderItem={({ item: exercise }) => {
                return (
                  <View className="w-full justify-start items-start mb-5">
                    <Text className="text-lg font-base mb-2">
                      {exercise.name}
                    </Text>
                    <FlatList
                      data={exercise.sets}
                      style={{ width: '100%' }}
                      renderItem={({ item, index }) => {
                        return (
                          <View className="w-full flex-row justify-start items-start my-2">
                            <Text
                              className={`text-md w-[${SET_COLUMN_WIDTH}px] text-center mr-5`}
                            >
                              {index + 1}
                            </Text>
                            <Text
                              className={`text-md w-[${PREVIOUS_COLUMN_WIDTH}px] text-center mr-5`}
                            >
                              {item.weight} x {item.reps}
                            </Text>
                            {exercise.tags.map((tag, index) => {
                              let value = 0;
                              switch (tag) {
                                case ExerciseTag.WEIGHT:
                                  value = item.weight;
                                  break;
                                case ExerciseTag.REPS:
                                  value = item.reps;
                                  break;
                                case ExerciseTag.DISTANCE:
                                  value = item.distance;
                                  break;
                                case ExerciseTag.TIME:
                                  value = item.time;
                                  break;
                              }

                              console.log(
                                index,
                                exercise.tags.length - 1,
                                tag,
                                getTagColumnWidth(tag),
                              );

                              return (
                                <TextInput
                                  key={tag}
                                  style={{ width: getTagColumnWidth(tag) }}
                                  className={clsx(
                                    'text-md text-center bg-white rounded',
                                    {
                                      'mr-5':
                                        index !== exercise.tags.length - 1,
                                    },
                                  )}
                                  defaultValue={value.toString()}
                                />
                              );
                            })}
                            <TouchableOpacity className="ml-auto">
                              <View className="w-6 h-6 bg-gray rounded justify-center items-center">
                                <Ionicons
                                  name="checkmark-outline"
                                  style={{
                                    color: 'white',
                                    fontSize: 16,
                                  }}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                      ListHeaderComponent={() => (
                        <View className="w-full flex-row justify-start items-start mb-2">
                          <Text
                            className={`text-md font-semibold w-[${SET_COLUMN_WIDTH}px] text-center mr-5`}
                          >
                            SET
                          </Text>
                          <Text
                            className={`text-md font-semibold w-[${PREVIOUS_COLUMN_WIDTH}px] text-center mr-5`}
                          >
                            PREVIOUS
                          </Text>
                          {exercise.tags.map((tag, index) => (
                            <Text
                              key={tag}
                              className={`text-md font-semibold w-[${getTagColumnWidth(tag)}px] text-center ${index === exercise.tags.length - 1 ? '' : 'mr-5'}`}
                            >
                              {turnTagIntoString(tag)}
                            </Text>
                          ))}
                        </View>
                      )}
                      ListFooterComponent={() => (
                        <View className="w-full justify-center items-center mt-2">
                          <TouchableOpacity>
                            <Text className="text-blue text-md font-semibold">
                              ADD SET
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  </View>
                );
              }}
              ListEmptyComponent={() => <View className="h-24" />}
            />

            <View className="w-full justify-center items-center mt-5">
              <TouchableOpacity className="mb-4">
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
