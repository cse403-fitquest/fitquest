import clsx from 'clsx';
import { Ionicons } from '@expo/vector-icons';
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
  ScrollView,
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
import { Href, router } from 'expo-router';
import { useWorkoutStore } from '@/store/workout';
import {
  convertSecondsToMMSS,
  didUserLevelUp,
  getTagColumnWidth,
  printExerciseDisplays,
  turnTagIntoString,
  updateUserAfterExpGain,
} from '@/utils/workout';
import { finishAndSaveWorkout } from '@/services/workout';
import { useUserStore } from '@/store/user';
import { Alert } from 'react-native';
import { useGeneralStore } from '@/store/general';

const SET_COLUMN_WIDTH = 28;
// const PREVIOUS_COLUMN_WIDTH = 68;

const NewWorkout = () => {
  const { workout, setWorkout, clearWorkout } = useWorkoutStore();

  const [seconds, setSeconds] = useState(0);

  const { user, setUser } = useUserStore();

  const { setLoading } = useGeneralStore();

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

  useEffect(() => {
    if (!user) return;

    let interval: NodeJS.Timeout;

    const initializeTimer = async () => {
      const timeSinceLastWorkoutInSeconds = (
        (new Date().getTime() - workout.startedAt.getTime()) /
        1000
      ).toFixed(0);
      setSeconds(parseInt(timeSinceLastWorkoutInSeconds));

      startInterval();
    };

    const startInterval = () => {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    };

    initializeTimer();
    return () => clearInterval(interval);
  }, []);

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
    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    console.log('start toggling set', exerciseID, setID);
    const updatedExercises = workout.exercises.map((exercise) => {
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

              // If exercise includes distance and nothing else, check if distance is 0
              if (
                exercise.tags.includes(ExerciseTag.DISTANCE) &&
                set.distance === 0 &&
                exercise.tags.length === 1
              ) {
                return set;
              }

              // If exercise includes time and nothing else, check if time is 0
              if (
                exercise.tags.includes(ExerciseTag.TIME) &&
                set.time === 0 &&
                exercise.tags.length === 1
              ) {
                return set;
              }

              // If exercise includes both distance and time, check if both are 0
              if (
                exercise.tags.includes(ExerciseTag.DISTANCE) &&
                exercise.tags.includes(ExerciseTag.TIME) &&
                set.distance === 0 &&
                set.time === 0
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
    setWorkout(() => ({
      ...workout,
      exercises: updatedExercises,
    }));

    console.log('end toggling set');
  };

  const handleAddSet: (exerciseID: string) => void = (exerciseID) => {
    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    console.log('start adding set', exerciseID);
    const updatedExercises = workout.exercises.map((exercise) => {
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
    setWorkout(() => ({
      ...workout,
      exercises: updatedExercises,
    }));

    console.log('end adding set');
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
    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    console.log('start updating set', exerciseID, setID, tag, value);

    // Valdiate value
    if (value < 0) {
      value = 0;
    }

    const updatedExercises = workout.exercises.map((exercise) => {
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
    setWorkout(() => ({
      ...workout,
      exercises: updatedExercises,
    }));

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
    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    console.log('start deleting set', exerciseID, setID);

    setWorkout((prevWorkout) => {
      const updatedExercisesWithDeletedSet = prevWorkout.exercises.map(
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

      return {
        ...prevWorkout,
        exercises: updatedExercises,
      };
    });

    // after removing the item, we start animation
    LayoutAnimation.configureNext(layoutAnimConfig);
  }, []);

  const moveExercise = (fromIndex: number, toIndex: number) => {
    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    const updatedExercises = [...workout.exercises];
    const [removed] = updatedExercises.splice(fromIndex, 1);
    updatedExercises.splice(toIndex, 0, removed);

    setWorkout(() => ({
      ...workout,
      exercises: updatedExercises,
    }));
  };

  const onFinishWorkoutPress = () => {
    // Check if there are no completed sets
    let hasCompletedSets = false;
    for (const exercise of workout.exercises) {
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
          <View
            className="w-full justify-start items-start pt-3 pb-1"
            testID="finish-cancel-workout-confirm-modal"
          >
            <Text>
              There are no completed sets. Are you sure you want to finish? This
              will amount to cancelling this workout
            </Text>
          </View>
        ),
        confirmText: 'FINISH WORKOUT',
        onConfirm: () => {
          setModalVisible(false);
          // Cancel workout
          clearWorkout();
          router.replace('/workout' as Href);
        },
        cancelText: 'CANCEL',
      });

      setModalVisible(true);
      return;
    }

    const expGain = seconds;

    setModalContent({
      title: 'Finished?',
      content: (
        <View
          className="w-full justify-start items-start pt-3 pb-1"
          testID="finish-workout-confirm-modal"
        >
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
        <View
          className="w-full justify-start items-start pt-3 pb-1"
          testID="cancel-workout-confirm-modal"
        >
          <Text>
            Are you sure you want to cancel and discard this workout? This
            cannot be undone.
          </Text>
        </View>
      ),
      confirmText: 'CANCEL THIS WORKOUT',
      onConfirm: () => {
        if (!user) {
          console.error('User not found');
          return;
        }
        setModalVisible(false);
        clearWorkout();
        router.back();
      },
      cancelText: 'BACK',
      onCancel: () => {
        setModalVisible(false);
      },
    });

    setModalVisible(true);
  };

  const handleFinishWorkout = async (seconds: number) => {
    if (!user) {
      console.error('User not found');
      return;
    }

    setLoading(true);

    // Filter out sets that are not completed
    const exercisesWithCompletedSets = workout.exercises.map((exercise) => {
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
    const newWorkout: Workout = {
      id: uuidv4(),
      title: workout.name,
      startedAt: workout.startedAt,
      duration: seconds,
      exercises: exercises,
    };

    // Print workout object
    printWorkout(newWorkout);

    const userAfterExpGain = updateUserAfterExpGain(user, newWorkout.duration);

    // Optimistic update to user's workout history and exp
    const oldUser = user;
    setUser({
      ...user,
      workoutHistory: [newWorkout, ...user.workoutHistory],
      exp: userAfterExpGain.exp,
      attributePoints: userAfterExpGain.attributePoints,
      activeWorkoutMinutes:
        userAfterExpGain.activeWorkoutMinutes + newWorkout.duration,
    });

    console.log('User workout history and exp updated.');

    // Save workout object to BE
    // Update user exp
    const finishAndSaveWorkoutResponse = await finishAndSaveWorkout(
      user.id,
      newWorkout,
    );

    setLoading(false);

    if (!finishAndSaveWorkoutResponse.success) {
      Alert.alert(
        'Error finishing and saving workout:',
        finishAndSaveWorkoutResponse.error || 'An error occurred.',
      );
      // Revert to old user
      setUser(oldUser);
      return;
    }

    // Clear workout
    clearWorkout();

    // Check if user leveled up
    if (didUserLevelUp(user, userAfterExpGain)) {
      console.log('User leveled up');
      // Redirect to workout screen
      router.replace({
        pathname: '/workout',
        params: { didUserLevelUp: 'true' },
      });
    } else {
      console.log('User did not level up');
      // Redirect to workout screen
      router.replace({
        pathname: '/workout',
        params: { didUserLevelUp: 'false' },
      });
    }
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

      <ScrollView className="w-full">
        <View className="relative w-full justify-start items-start px-6 pt-8">
          <View className="w-full flex-row justify-between items-center mb-5">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={35} color="black" />
            </TouchableOpacity>
            <View className="flex-row">
              <TouchableOpacity
                onPress={onFinishWorkoutPress}
                className="p-1"
                testID="finish-workout-button"
              >
                <Text className="text-blue text-lg font-semibold">FINISH</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            className="w-full text-lg font-semibold mb-2"
            onChangeText={(text) =>
              setWorkout((prev) => ({ ...prev, name: text }))
            }
            value={workout.name}
            defaultValue={''}
          />
          <Text className="text-grayDark text-sm mb-8">
            {secondsToHHmmss(seconds)}
          </Text>

          {/* Exercises here */}
        </View>
        <View className="relative w-full justify-start items-start">
          <FlatList
            data={workout.exercises}
            scrollEnabled={false}
            style={{ width: '100%' }}
            keyExtractor={(exercise) => exercise.id}
            renderItem={({ item: exercise, index: exerciseIndex }) => {
              return (
                <View className="w-full justify-start items-start mb-5">
                  <View className="w-full flex-row justify-between items-center px-6">
                    <Text className="text-lg font-base mb-2">
                      {exercise.name}
                    </Text>
                    <View className="flex-row">
                      {exerciseIndex !== 0 ? (
                        <TouchableOpacity
                          className="p-1"
                          onPress={() =>
                            moveExercise(exerciseIndex, exerciseIndex - 1)
                          }
                        >
                          <Ionicons
                            name="chevron-up-outline"
                            style={{
                              fontSize: 25,
                              color: 'black',
                            }}
                          />
                        </TouchableOpacity>
                      ) : null}
                      {exerciseIndex !== workout.exercises.length - 1 ? (
                        <TouchableOpacity
                          className="p-1"
                          onPress={() =>
                            moveExercise(exerciseIndex, exerciseIndex + 1)
                          }
                        >
                          <Ionicons
                            name="chevron-down-outline"
                            style={{
                              fontSize: 25,
                              color: 'black',
                            }}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
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
                      <View className="w-full flex-row justify-start items-start mb-2 px-6">
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
            ListEmptyComponent={() => <View className="h-5" />}
          />
        </View>
        <View className="w-full justify-center items-center mt-5 pb-8">
          <TouchableOpacity
            className="mb-4"
            onPress={() =>
              router.push({
                pathname: '/add-exercises',
                params: {
                  isActiveWorkout: 'true',
                },
              })
            }
          >
            <Text
              className="text-blue text-lg font-semibold "
              testID="add-exercises-button"
            >
              ADD EXERCISE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onCancelWorkoutPress}
            testID="cancel-workout-button"
          >
            <Text className="text-red-500 text-lg font-semibold">
              CANCEL WORKOUT
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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

  const windowWidth = Dimensions.get('window').width;

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

  return (
    <View className="relative" testID={`set-item-${set.id}`}>
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: translateX }],
        }}
      >
        <View
          {...panResponder.panHandlers}
          className="relative w-full flex-row justify-start items-center my-1 py-1 px-6"
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
                testID={`set-input-${set.id}-${tag}`}
                selectTextOnFocus={tag !== ExerciseTag.TIME}
                onChangeText={(text) => {
                  if (tag !== ExerciseTag.TIME) {
                    // Parse the new value
                    const newValue = text === '' ? 0 : parseInt(text);

                    if (isNaN(newValue)) {
                      setValue(0);
                      return;
                    }

                    setValue(newValue);
                    return;
                  }

                  // Handle set for time

                  // Check if the input doesnt have exactly 5 characters
                  // If it does, default to 0
                  if (text.length < 5 || text.length > 6) {
                    setValue(0);
                    return;
                  }

                  // Shift the value to the rightmost side of the input string (mm:ss)
                  const m2 = text.charAt(1);
                  const s1 = text.charAt(3);
                  const s2 = text.charAt(4);

                  // Replace the value with the new value
                  const newValue = `${m2}${s1}:${s2}${text.charAt(5)}`;

                  // Parse the new value
                  const minutes = parseInt(newValue.substring(0, 2));
                  const seconds = parseInt(newValue.substring(3, 5));

                  const totalSeconds = minutes * 60 + seconds;

                  setValue(totalSeconds);
                }}
                onEndEditing={() => {
                  onUpdateSet(tag, value);
                }}
                onBlur={() => {
                  console.log('onBlur');
                  onUpdateSet(tag, value);
                }}
                value={
                  tag === ExerciseTag.TIME
                    ? convertSecondsToMMSS(value)
                    : value.toString()
                }
              />
            );
          })}
          <TouchableOpacity
            className="ml-auto p-1"
            onPress={() => onCompleteSet()}
            testID={`complete-set-${set.id}`}
          >
            <View
              className={clsx('w-6 h-6 rounded justify-center items-center', {
                'bg-blue': set.completed,
                'bg-white border border': !set.completed,
              })}
            >
              <Ionicons
                name="checkmark-outline"
                style={{
                  color: `${set.completed ? 'white' : 'black'}`,
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
          <TouchableOpacity
            testID={`set-item-delete-${set.id}`}
            className="w-0 h-0"
            onPress={onDeleteSet}
          />
        </View>
      </Animated.View>
    </View>
  );
};
