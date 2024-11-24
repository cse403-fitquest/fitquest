import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import {
  Exercise,
  ExerciseDisplay,
  ExerciseSetDisplay,
  ExerciseTag,
  Workout,
} from '@/types/workout';
import { EXERCISES_STUB } from '@/constants/workout';
import { Href, router } from 'expo-router';

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
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
    onConfirm: () => void;
    confirmText?: string;
    onCancel?: () => void;
    cancelText?: string;
  }>(
    // Default modal content
    {
      title: 'Finished?',
      content: <View />,
      onConfirm: () => {},
    },
  );

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
              id: uuidv4(),
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

  const handleToggleCompleteSet: (exerciseID: string, setID: string) => void = (
    exerciseID,
    setID,
  ) => {
    console.log('start toggling set', exerciseID, setID);
    const updatedExercises = workoutExercises.map((exercise) => {
      if (exercise.id === exerciseID) {
        return {
          ...exercise,
          sets: exercise.sets.map((set) => {
            if (set.id === setID) {
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

    printExerciseDisplays(updatedExercises);
    setWorkoutExercises(updatedExercises);

    console.log('end toggling set');
  };

  const handleAddSet: (exerciseID: string) => void = (exerciseID) => {
    console.log('start adding set', exerciseID);
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

    printExerciseDisplays(updatedExercises);
    setWorkoutExercises(updatedExercises);

    console.log('end adding set');
  };

  // Helper function to print exercise display
  const printExerciseDisplays = (exercises: ExerciseDisplay[]) => {
    for (const exercise of exercises) {
      console.log(exercise.name);
      for (const set of exercise.sets) {
        // Print only relevant tags

        let str =
          'ID: ' +
          set.id.slice(0, 5) +
          ' | Set ' +
          (exercise.sets.indexOf(set) + 1) +
          ': ';
        if (exercise.tags.includes(ExerciseTag.WEIGHT)) {
          str += `WEIGHT: ${set.weight} `;
        }
        if (exercise.tags.includes(ExerciseTag.REPS)) {
          str += `REPS: ${set.reps} `;
        }
        if (exercise.tags.includes(ExerciseTag.DISTANCE)) {
          str += `DISTANCE: ${set.distance} `;
        }
        if (exercise.tags.includes(ExerciseTag.TIME)) {
          str += `TIME: ${set.time} `;
        }

        console.log(str);
      }
    }
  };

  // Helper function to print workout object
  const printWorkout = (workout: Workout) => {
    console.log('Workout Title:', workout.title);
    console.log('Workout Started At:', workout.startedAt);
    console.log('Workout Duration:', workout.duration);
    for (const exercise of workout.exercises) {
      console.log(exercise.name);
      for (const set of exercise.sets) {
        // Print only relevant tags

        let str = 'Set ' + (exercise.sets.indexOf(set) + 1) + ': ';
        if (exercise.tags.includes(ExerciseTag.WEIGHT)) {
          str += `WEIGHT: ${set.weight} `;
        }
        if (exercise.tags.includes(ExerciseTag.REPS)) {
          str += `REPS: ${set.reps} `;
        }
        if (exercise.tags.includes(ExerciseTag.DISTANCE)) {
          str += `DISTANCE: ${set.distance} `;
        }
        if (exercise.tags.includes(ExerciseTag.TIME)) {
          str += `TIME: ${set.time} `;
        }

        console.log(str);
      }
    }
  };

  const handleUpdateSet: (
    exerciseID: string,
    setID: string,
    tag: ExerciseTag,
    value: number,
  ) => void = (exerciseID, setID, tag, value) => {
    console.log('start updating set', exerciseID, setID, tag, value);

    // Valdiate value
    if (value < 0) {
      value = 0;
    }

    const updatedExercises = workoutExercises.map((exercise) => {
      if (exercise.id === exerciseID) {
        return {
          ...exercise,
          sets: exercise.sets.map((set) => {
            if (set.id === setID) {
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

    printExerciseDisplays(updatedExercises);
    setWorkoutExercises(updatedExercises);
    console.log('end updating set');
  };

  const layoutAnimConfig = {
    duration: 300,
    delete: {
      duration: 100,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const handleDeleteSet = useCallback((exerciseID: string, setID: string) => {
    console.log('start deleting set', exerciseID, setID);

    setWorkoutExercises((prevWorkoutExercises) => {
      const updatedExercisesWithDeletedSet = prevWorkoutExercises.map(
        (exercise) => {
          if (exercise.id === exerciseID) {
            if (exercise.sets.length === 1) {
              return {
                ...exercise,
                sets: [],
              };
            }

            return {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setID),
            };
          }

          return exercise;
        },
      );

      // If exercise has no sets, remove the exercise
      const updatedExercises = updatedExercisesWithDeletedSet.filter(
        (exercise) => exercise.sets.length > 0,
      );

      printExerciseDisplays(updatedExercises);
      console.log('end deleting set');

      return updatedExercises;
    });

    // after removing the item, we start animation
    LayoutAnimation.configureNext(layoutAnimConfig);
  }, []);

  const onFinishWorkoutPress = () => {
    // Check if there are no completed sets
    let hasCompletedSets = false;
    for (const exercise of workoutExercises) {
      for (const set of exercise.sets) {
        if (set.completed) {
          hasCompletedSets = true;
          break;
        }
      }
    }

    if (!hasCompletedSets) {
      setModalContent({
        title: 'No Completed Sets',
        content: (
          <View className="w-full justify-start items-start pt-3 pb-1">
            <Text>
              There are no completed sets. Are you sure you want to finish? This
              will amount to cancelling this workout
            </Text>
          </View>
        ),
        confirmText: 'CANCEL WORKOUT',
        onConfirm: () => {
          setModalVisible(false);
          // Cancel workout
        },
        cancelText: 'CANCEL',
      });

      setModalVisible(true);
      return;
    }

    const expGain = seconds * 500;

    setModalContent({
      title: 'Finished?',
      content: (
        <View className="w-full justify-start items-start pt-3 pb-1">
          <Text className="mb-3">All uncompleted sets will be discarded.</Text>

          <Text className="text-md font-bold">
            EXP GAIN:{' '}
            <Text className="text-yellow font-bold">{expGain} XP</Text>
          </Text>
        </View>
      ),
      confirmText: 'FINISH WORKOUT',
      onConfirm: () => {
        handleFinishWorkout(seconds);
        setModalVisible(false);
      },
      cancelText: 'CANCEL',
    });

    setModalVisible(true);
  };

  const onCancelWorkoutPress = () => {
    setModalContent({
      title: 'Cancel Workout?',
      content: (
        <View className="w-full justify-start items-start pt-3 pb-1">
          <Text>
            Are you sure you want to cancel and discard this workout? This
            cannot be undone.
          </Text>
        </View>
      ),
      confirmText: 'CANCEL WORKOUT',
      onConfirm: () => {
        setModalVisible(false);
      },
      cancelText: 'BACK',
      onCancel: () => {
        setModalVisible(false);
      },
    });

    setModalVisible(true);
  };

  const handleFinishWorkout = (seconds: number) => {
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
      duration: seconds,
      exercises: exercises,
    };

    // Print workout object
    printWorkout(workout);

    // TODO: Save workout object
    // TODO: Update user exp
    // TODO: Redirect to workout screen
  };

  return (
    <SafeAreaView className="relative w-full h-full justify-start items-start bg-offWhite">
      <FQModal
        title={modalContent.title}
        visible={modalVisible}
        setVisible={setModalVisible}
        onCancel={modalContent.onCancel}
        onConfirm={modalContent.onConfirm}
        confirmText={modalContent.confirmText}
        cancelText={modalContent.cancelText}
      >
        {modalContent.content}
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
                            key={set.id}
                            exercise={exercise}
                            set={set}
                            setIndex={setIndex}
                            onCompleteSet={() =>
                              handleToggleCompleteSet(exercise.id, set.id)
                            }
                            onUpdateSet={(tag, value) =>
                              handleUpdateSet(exercise.id, set.id, tag, value)
                            }
                            onDeleteSet={() =>
                              handleDeleteSet(exercise.id, set.id)
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
            <View className="w-full flex-row justify-end">
              <TouchableOpacity onPress={onFinishWorkoutPress} className="p-1">
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
            <TouchableOpacity
              className="mb-4"
              onPress={() => router.push('add-exercises' as Href)}
            >
              <Text className="text-blue text-lg font-semibold ">
                ADD EXERCISE
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancelWorkoutPress}>
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
            const [value, setValue] = useState(() => {
              switch (tag) {
                case ExerciseTag.WEIGHT:
                  return set.weight;
                case ExerciseTag.REPS:
                  return set.reps;
                case ExerciseTag.DISTANCE:
                  return set.distance;
                case ExerciseTag.TIME:
                  return set.time;
                default:
                  return 0;
              }
            });

            return (
              <TextInput
                key={set.id + tag}
                keyboardType="numeric"
                style={{ width: getTagColumnWidth(tag) }}
                className={clsx('text-md text-center bg-white rounded', {
                  'mr-5': index !== exercise.tags.length - 1,
                })}
                onChangeText={(text) => {
                  const newValue = text === '' ? 0 : parseInt(text);
                  setValue(newValue);
                }}
                onEndEditing={() => {
                  onUpdateSet(tag, value);
                }}
                onBlur={() => {
                  onUpdateSet(tag, value);
                }}
                value={value.toString()}
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
