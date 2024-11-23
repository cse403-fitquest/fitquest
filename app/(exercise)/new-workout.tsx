import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
} from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';
import FQModal from '@/components/FQModal';

const enum ExerciseTag {
  WEIGHT = 'WEIGHT',
  REPS = 'REPS',
  DISTANCE = 'DISTANCE',
  TIME = 'TIME',
}

type ExerciseSet = {
  id: string;
  weight: number;
  reps: number;
  distance: number;
  time: number;
};

type ExerciseSetDisplay = {
  id: string;
  weight: number;
  reps: number;
  distance: number;
  time: number;
  completed: boolean;
};

type Exercise = {
  id: string;
  name: string;
  tags: ExerciseTag[];
  sets: ExerciseSet[];
};

type ExerciseDisplay = {
  id: string;
  name: string;
  tags: ExerciseTag[];
  sets: ExerciseSetDisplay[];
};

type Workout = {
  title: string;
  startedAt: Date;
  duration: number;
  exercises: Exercise[];
};

const EXERCISES_STUB: Exercise[] = [
  {
    id: uuidv4(),
    name: 'Bench Press',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
    sets: [
      {
        id: uuidv4(),
        weight: 100,
        reps: 10,
        distance: 0,
        time: 0,
      },
      {
        id: uuidv4(),
        weight: 100,
        reps: 10,
        distance: 0,
        time: 0,
      },
    ],
  },
  {
    id: uuidv4(),
    name: 'Jogging',
    tags: [ExerciseTag.DISTANCE, ExerciseTag.TIME],
    sets: [
      {
        id: uuidv4(),
        weight: 0,
        reps: 0,
        distance: 5,
        time: 30,
      },
      {
        id: uuidv4(),
        weight: 0,
        reps: 0,
        distance: 5,
        time: 30,
      },
    ],
  },
];

const SET_COLUMN_WIDTH = 40;
// const PREVIOUS_COLUMN_WIDTH = 68;

export const getTagColumnWidth = (tag: ExerciseTag) => {
  switch (tag) {
    case ExerciseTag.WEIGHT:
      return 80;
    case ExerciseTag.REPS:
      return 80;
    case ExerciseTag.DISTANCE:
      return 80;
    case ExerciseTag.TIME:
      return 80;
    default:
      return 80;
  }
};

const NewWorkout = () => {
  const [workoutName, setWorkoutName] = useState('Empty Workout');
  let tempWorkoutName = workoutName;

  const [workoutExercises, setWorkoutExercises] = useState<ExerciseDisplay[]>(
    [],
  );

  const [seconds, setSeconds] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);

  const workoutStartDate = new Date();

  useEffect(() => {
    setWorkoutExercises(
      EXERCISES_STUB.map((exercise) => {
        return {
          ...exercise,
          id: uuidv4(),
          sets: exercise.sets.map((set) => {
            return {
              ...set,
              completed: false,
            };
          }),
        };
      }),
    );

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // const turnDateIntoString = (date: Date) => {
  //   const dayIndex = date.getDay();
  //   let day = 'Sunday';
  //   switch (dayIndex) {
  //     case 0:
  //       day = 'Sunday';
  //       break;
  //     case 1:
  //       day = 'Monday';
  //       break;
  //     case 2:
  //       day = 'Tuesday';
  //       break;
  //     case 3:
  //       day = 'Wednesday';
  //       break;
  //     case 4:
  //       day = 'Thursday';
  //       break;
  //     case 5:
  //       day = 'Friday';
  //       break;
  //     case 6:
  //       day = 'Saturday';
  //       break;
  //   }

  //   const monthIndex = date.getMonth();
  //   let month = 'January';
  //   switch (monthIndex) {
  //     case 0:
  //       month = 'January';
  //       break;
  //     case 1:
  //       month = 'February';
  //       break;
  //     case 2:
  //       month = 'March';
  //       break;
  //     case 3:
  //       month = 'April';
  //       break;
  //     case 4:
  //       month = 'May';
  //       break;
  //     case 5:
  //       month = 'June';
  //       break;
  //     case 6:
  //       month = 'July';
  //       break;
  //     case 7:
  //       month = 'August';
  //       break;
  //     case 8:
  //       month = 'September';
  //       break;
  //     case 9:
  //       month = 'October';
  //       break;
  //     case 10:
  //       month = 'November';
  //       break;
  //     case 11:
  //       month = 'December';
  //       break;
  //   }

  //   const hourIndex = date.getHours();
  //   let hour = hourIndex.toString();
  //   if (hourIndex < 10) {
  //     hour = `0${hourIndex}`;
  //   }

  //   const minuteIndex = date.getMinutes();
  //   let minute = minuteIndex.toString();
  //   if (minuteIndex < 10) {
  //     minute = `0${minuteIndex}`;
  //   }

  //   return `${day}, ${month} ${date.getDate()}, ${date.getFullYear()} at ${hour}:${minute}`;
  // };

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

  const secondsToHHmmss = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let hoursString = hours.toString();
    let minutesString = minutes.toString();
    let remainingSecondsString = remainingSeconds.toString();

    if (hours < 10) {
      hoursString = `0${hours}`;
    }

    if (minutes < 10) {
      minutesString = `0${minutes}`;
    }

    if (remainingSeconds < 10) {
      remainingSecondsString = `0${remainingSeconds}`;
    }

    return `${hoursString}:${minutesString}:${remainingSecondsString}`;
  };

  const handleToggleCompleteSet: (
    exerciseID: string,
    setIndex: number,
  ) => void = (exerciseID, setIndex) => {
    console.log('start toggling set');
    const updatedExercises = workoutExercises.map((exercise) => {
      if (exercise.id === exerciseID) {
        return {
          ...exercise,
          sets: exercise.sets.map((set, idx) => {
            if (setIndex === idx) {
              // If set is empty, do nothing
              if (
                set.distance === 0 &&
                set.time === 0 &&
                set.reps === 0 &&
                set.weight === 0
              ) {
                return set;
              }

              // If exercise includes reps, check if reps is 0
              if (exercise.tags.includes(ExerciseTag.REPS) && set.reps === 0) {
                return set;
              }

              // If exercise includes distance, check if distance is 0
              if (
                exercise.tags.includes(ExerciseTag.DISTANCE) &&
                set.distance === 0
              ) {
                return set;
              }

              return {
                ...set,
                completed: !set.completed,
              };
            }

            return set;
          }),
        };
      }

      return exercise;
    });

    setWorkoutExercises(updatedExercises);

    console.log('end toggling set');
  };

  const handleAddSet: (exerciseID: string) => void = (exerciseID) => {
    const updatedExercises = workoutExercises.map((exercise) => {
      if (exercise.id === exerciseID) {
        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              id: uuidv4(),
              weight: 0,
              reps: 0,
              distance: 0,
              time: 0,
              completed: false,
            },
          ],
        };
      }

      return exercise;
    });

    setWorkoutExercises(updatedExercises);
  };

  const handleUpdateSet: (
    exerciseID: string,
    setIndex: number,
    tag: ExerciseTag,
    value: number,
  ) => void = (exerciseID, setIndex, tag, value) => {
    console.log('start updating set');

    // Valdiate value
    if (value < 0) {
      value = 0;
    }

    const updatedExercises = workoutExercises.map((exercise) => {
      if (exercise.id === exerciseID) {
        return {
          ...exercise,
          sets: exercise.sets.map((set, idx) => {
            if (setIndex === idx) {
              let tagToUpdate = 'weight';
              switch (tag) {
                case ExerciseTag.WEIGHT:
                  tagToUpdate = 'weight';
                  break;
                case ExerciseTag.REPS:
                  tagToUpdate = 'reps';
                  break;
                case ExerciseTag.DISTANCE:
                  tagToUpdate = 'distance';
                  break;
                case ExerciseTag.TIME:
                  tagToUpdate = 'time';
                  break;
              }
              return {
                ...set,
                [tagToUpdate]: value,
              };
            }

            return set;
          }),
        };
      }

      return exercise;
    });

    setWorkoutExercises(updatedExercises);
    console.log('end updating set');
  };

  const layoutAnimConfig = {
    duration: 300,
    delete: {
      duration: 200,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const handleDeleteSet: (exerciseID: string, setIndex: number) => void = (
    exerciseID,
    setIndex,
  ) => {
    const updatedExercises = workoutExercises.map((exercise) => {
      if (exercise.id === exerciseID) {
        return {
          ...exercise,
          sets: exercise.sets.filter((_, idx) => idx !== setIndex),
        };
      }

      return exercise;
    });

    setWorkoutExercises(updatedExercises);

    // after removing the item, we start animation
    LayoutAnimation.configureNext(layoutAnimConfig);
  };

  const handleFinishWorkout = () => {
    // Filter out  sets that are not completed
    const exercisesWithCompletedSets = workoutExercises.map((exercise) => {
      return {
        ...exercise,
        sets: exercise.sets.filter((set) => {
          // Check if set is completed
          if (!set.completed) {
            return false;
          }
          return true;
        }),
      };
    });

    // Remove exercises with no completed sets
    const exercisesThatHasCompletedSets = exercisesWithCompletedSets.filter(
      (exercise) => exercise.sets.length > 0,
    );

    // Turn Execises with SetDisplay into Exercises with Set (no completed field)
    const exercises: Exercise[] = exercisesThatHasCompletedSets.map(
      (exercise) => {
        return {
          ...exercise,
          sets: exercise.sets.map((set) => {
            return {
              id: set.id,
              weight: set.weight,
              reps: set.reps,
              distance: set.distance,
              time: set.time,
            };
          }),
        };
      },
    );

    // Create workout object
    const workout: Workout = {
      title: workoutName,
      startedAt: workoutStartDate,
      duration: (new Date().getTime() - workoutStartDate.getTime()) * 0.001,
      exercises: exercises,
    };

    // Print workout object
    for (const exercise of workout.exercises) {
      console.log(exercise.name);
      for (const set of exercise.sets) {
        console.log(set);
      }
    }
  };

  return (
    <SafeAreaView className="relative w-full h-full justify-start items-start bg-offWhite">
      <FQModal
        title="Add Exercise"
        visible={modalVisible}
        setVisible={setModalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={() => setModalVisible(false)}
      >
        <Text>Test</Text>
      </FQModal>

      <FlatList
        data={['']}
        renderItem={() => (
          <View className="relative w-full justify-start items-start px-6">
            <FlatList
              data={workoutExercises}
              style={{ width: '100%' }}
              keyExtractor={(exercise) => exercise.id}
              renderItem={({ item: exercise }) => {
                return (
                  <View className="w-full justify-start items-start mb-5">
                    <Text className="text-lg font-base mb-2">
                      {exercise.name}
                    </Text>
                    <FlatList
                      data={exercise.sets}
                      style={{ width: '100%' }}
                      keyExtractor={(set) => set.id}
                      renderItem={({ item: set, index: setIndex }) => {
                        return (
                          <SetItem
                            exercise={exercise}
                            set={set}
                            setIndex={setIndex}
                            onCompleteSet={() =>
                              handleToggleCompleteSet(exercise.id, setIndex)
                            }
                            onUpdateSet={(tag, value) =>
                              handleUpdateSet(exercise.id, setIndex, tag, value)
                            }
                            onDeleteSet={() =>
                              handleDeleteSet(exercise.id, setIndex)
                            }
                          />
                        );
                      }}
                      ListHeaderComponent={() => (
                        <View className="w-full flex-row justify-start items-start mb-2">
                          <Text
                            className={`text-md font-semibold text-center mr-5`}
                            style={{ width: SET_COLUMN_WIDTH }}
                          >
                            SET
                          </Text>
                          {/* <Text
                        className={`text-md font-semibold text-center mr-5`}
                        style={{ width: PREVIOUS_COLUMN_WIDTH }}
                      >
                        PREVIOUS
                      </Text> */}
                          {exercise.tags.map((tag, index) => (
                            <Text
                              key={tag}
                              className={`text-md font-semibold text-center`}
                              style={{
                                width: getTagColumnWidth(tag),
                                marginRight:
                                  index === exercise.tags.length - 1 ? 0 : 20,
                              }}
                            >
                              {turnTagIntoString(tag)}
                            </Text>
                          ))}
                        </View>
                      )}
                      ListFooterComponent={() => (
                        <View className="w-full justify-center items-center mt-4">
                          <TouchableOpacity
                            onPress={() => handleAddSet(exercise.id)}
                          >
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
          </View>
        )}
        style={{ width: '100%' }}
        ListHeaderComponent={() => (
          <View className="relative w-full justify-start items-start px-6 pt-8">
            <View className="w-full flex-row justify-end mb-2">
              <TouchableOpacity onPress={handleFinishWorkout} className="p-1">
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
              {secondsToHHmmss(seconds)}
              {/* {turnDateIntoString(workoutStartDate)} */}
            </Text>

            {/* Exercises here */}
          </View>
        )}
        ListFooterComponent={() => (
          <View className="w-full justify-center items-center mt-5 pb-8">
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
        )}
      />
    </SafeAreaView>
  );
};

export default NewWorkout;

const SetItem: React.FC<{
  exercise: ExerciseDisplay;
  set: ExerciseSetDisplay;
  setIndex: number;
  onCompleteSet: () => void;
  onUpdateSet: (tag: ExerciseTag, value: number) => void;
  onDeleteSet: () => void;
}> = ({ exercise, set, setIndex, onCompleteSet, onUpdateSet, onDeleteSet }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        if (Math.abs(gesture?.dx) > Math.abs(gesture?.dy) && gesture.dx < -20) {
          return true;
        }
        return false;
      },
      onPanResponderMove: (_, gestureState) => {
        if (Math.abs(gestureState?.dx) > Math.abs(gestureState?.dy)) {
          if (gestureState.dx < 0) {
            translateX.setValue(gestureState.dx);
          }
          return true;
        }
        return false;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -windowWidth * 0.5) {
          onDeleteSet();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const windowWidth = Dimensions.get('window').width;

  return (
    <View className="relative">
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: translateX }],
        }}
      >
        <View
          {...panResponder.panHandlers}
          className="relative w-full flex-row justify-start items-center my-1 py-1"
        >
          {set.completed ? (
            <View className="absolute left-[-24px] bg-blue opacity-30 w-[150%] h-full py-5" />
          ) : null}
          <Text
            className={`text-md text-center mr-5`}
            style={{ width: SET_COLUMN_WIDTH }}
          >
            {setIndex + 1}
          </Text>
          {exercise.tags.map((tag, index) => {
            let value = 0;
            switch (tag) {
              case ExerciseTag.WEIGHT:
                value = set.weight;
                break;
              case ExerciseTag.REPS:
                value = set.reps;
                break;
              case ExerciseTag.DISTANCE:
                value = set.distance;
                break;
              case ExerciseTag.TIME:
                value = set.time;
                break;
            }

            return (
              <TextInput
                key={tag}
                keyboardType="numeric"
                style={{ width: getTagColumnWidth(tag) }}
                className={clsx('text-md text-center bg-white rounded', {
                  'mr-5': index !== exercise.tags.length - 1,
                })}
                onChangeText={(text) => (value = parseInt(text))}
                onEndEditing={() => onUpdateSet(tag, value)}
                onBlur={() => onUpdateSet(tag, value)}
                defaultValue={value.toString()}
              />
            );
          })}
          <TouchableOpacity
            className="ml-auto p-1"
            onPress={() => onCompleteSet()}
          >
            <View
              className={clsx('w-6 h-6 rounded justify-center items-center', {
                'bg-blue': set.completed,
                'bg-gray': !set.completed,
              })}
            >
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
        <View
          className="absolute h-full justify-center items-start bg-red-500"
          style={{ width: windowWidth, right: -windowWidth - 24 }}
        >
          <Text className="text-white font-bold text-left pl-5">
            SWIPE LEFT TO DELETE
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};
