import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';
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
  getTagColumnWidth,
  printExerciseDisplays,
  turnTagIntoString,
} from '@/utils/workout';
import { useUserStore } from '@/store/user';
import { saveWorkoutTemplate } from '@/services/workout';
import { useGeneralStore } from '@/store/general';

const SET_COLUMN_WIDTH = 40;
// const PREVIOUS_COLUMN_WIDTH = 68;

const NewWorkout = () => {
  const { workoutDisplay, setWorkoutDisplay } = useWorkoutStore();

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

  const workoutStartDate = new Date();

  const handleAddSet: (exerciseID: string) => void = (exerciseID) => {
    console.log('start adding set', exerciseID);
    const updatedExercises = workoutDisplay.exercises.map((exercise) => {
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
    setWorkoutDisplay(() => {
      return {
        ...workoutDisplay,
        exercises: updatedExercises,
      };
    });

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
    console.log('start updating set', exerciseID, setID, tag, value);

    // Valdiate value
    if (value < 0) {
      value = 0;
    }

    const updatedExercises = workoutDisplay.exercises.map((exercise) => {
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
    setWorkoutDisplay(() => ({
      ...workoutDisplay,
      exercises: updatedExercises,
    }));
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

  const handleDeleteSet = useCallback((exerciseID: string, setID: string) => {
    console.log('start deleting set', exerciseID, setID);

    setWorkoutDisplay((prevWorkout) => {
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
    const updatedExercises = [...workoutDisplay.exercises];
    const [removed] = updatedExercises.splice(fromIndex, 1);
    updatedExercises.splice(toIndex, 0, removed);

    setWorkoutDisplay(() => ({
      ...workoutDisplay,
      exercises: updatedExercises,
    }));
  };

  const onSaveTemplatePress = () => {
    setModalContent({
      title: 'Save template?',
      content: (
        <View className="w-full justify-start items-start pt-3 pb-1">
          <Text>Are you sure you wish to save this template?</Text>
        </View>
      ),
      confirmText: 'SAVE TEMPLATE',
      onConfirm: () => {
        setModalVisible(false);
        handleSaveTemplate();
      },
      cancelText: 'CANCEL',
    });

    setModalVisible(true);
  };

  const handleSaveTemplate = async () => {
    if (!user) return;

    setLoading(true);

    // Turn Execises with SetDisplay into Exercises with Set (no completed field)
    const exercises: Exercise[] = workoutDisplay.exercises.map((exercise) => {
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
    });

    // Create workout object
    const workoutTemplate: Workout = {
      id: workoutDisplay.id,
      title: workoutDisplay.name,
      startedAt: workoutStartDate,
      duration: 0,
      exercises: exercises,
    };

    // Print workoutTemplate object
    printWorkout(workoutTemplate);

    // Save workoutTemplate template to database and update user store
    const oldUser = user;

    // Check if workout template already exists
    if (
      oldUser.savedWorkoutTemplates.find(
        (template) => template.id === workoutTemplate.id,
      )
    ) {
      setUser({
        ...oldUser,
        savedWorkoutTemplates: oldUser.savedWorkoutTemplates.map((template) =>
          template.id === workoutTemplate.id ? workoutTemplate : template,
        ),
      });
    } else {
      setUser({
        ...oldUser,
        savedWorkoutTemplates: [
          workoutTemplate,
          ...oldUser.savedWorkoutTemplates,
        ],
      });
    }

    const saveWorkoutTemplateResponse = await saveWorkoutTemplate(
      user.id,
      workoutTemplate,
    );

    setLoading(false);

    if (saveWorkoutTemplateResponse.success) {
      console.log('Successfully saved workout template');
    } else {
      console.error('Failed to save workout template');

      // Revert user store
      setUser(oldUser);
      return;
    }

    router.back();
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
            <TouchableOpacity onPress={onSaveTemplatePress} className="p-1">
              <Text className="text-blue text-lg font-semibold">
                SAVE TEMPLATE
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            className="w-full text-lg font-semibold mb-8"
            onChangeText={(text) =>
              setWorkoutDisplay((prevWorkout) => ({
                ...prevWorkout,
                name: text,
              }))
            } // Update workout name
            value={workoutDisplay.name}
            defaultValue={''}
          />
          {/* Exercises here */}
        </View>
        <View className="relative w-full justify-start items-start">
          <FlatList
            data={workoutDisplay.exercises}
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
                      {exerciseIndex !== workoutDisplay.exercises.length - 1 ? (
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
            onPress={() => router.push('add-exercises' as Href)}
          >
            <Text className="text-blue text-lg font-semibold ">
              ADD EXERCISE
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
  onUpdateSet: (tag: ExerciseTag, value: number) => void;
  onDeleteSet: () => void;
}> = ({ exercise, set, setIndex, onUpdateSet, onDeleteSet }) => {
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
                onChange={(e) => {
                  // Get keystroke value
                  const text = e.nativeEvent.text;

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

                  // const newValue = text === '' ? 0 : parseInt(text);
                  setValue(totalSeconds);
                }}
                onEndEditing={() => {
                  onUpdateSet(tag, value);
                }}
                onBlur={() => {
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
