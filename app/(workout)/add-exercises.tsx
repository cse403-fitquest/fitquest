import {
  ALL_EXERCISES_STUB,
  BASE_EXERCISE_DISPLAY,
  MuscleGroup,
} from '@/constants/workout';
import { useUserStore } from '@/store/user';
import { useWorkoutStore } from '@/store/workout';
import {
  AddExerciseDisplay,
  ExerciseDisplay,
  ExerciseSetDisplay,
} from '@/types/workout';
import { printExerciseDisplays } from '@/utils/workout';
import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

const AddExercises = () => {
  const { isActiveWorkout } = useLocalSearchParams<{
    isActiveWorkout: string;
  }>();

  const [exercises, setExercises] = useState<AddExerciseDisplay[]>([]);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const { setWorkout, setWorkoutDisplay } = useWorkoutStore();
  const { user } = useUserStore();

  useEffect(() => {
    setExercises(
      ALL_EXERCISES_STUB.map((exercise) => ({
        ...exercise,
        id: uuid.v4(),
        selected: false,
      })),
    );
  }, []);

  const onExercisePress = (id: string) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === id
          ? { ...exercise, selected: !exercise.selected }
          : exercise,
      ),
    );

    setSelectedExerciseIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((prevId) => prevId !== id);
      }

      return [...prev, id];
    });
  };

  const chestExercisesSection = {
    title: 'Chest',
    data: exercises.filter(
      (exercise) => exercise.muscleGroup === MuscleGroup.CHEST,
    ),
  };

  const backExercisesSection = {
    title: 'Back',
    data: exercises.filter(
      (exercise) => exercise.muscleGroup === MuscleGroup.BACK,
    ),
  };

  const armExercisesSection = {
    title: 'Arms',
    data: exercises.filter(
      (exercise) => exercise.muscleGroup === MuscleGroup.ARMS,
    ),
  };

  const shouldersExercisesSection = {
    title: 'Shoulders',
    data: exercises.filter(
      (exercise) => exercise.muscleGroup === MuscleGroup.SHOULDERS,
    ),
  };

  const legsExercisesSection = {
    title: 'Legs',
    data: exercises.filter(
      (exercise) => exercise.muscleGroup === MuscleGroup.LEGS,
    ),
  };

  const coreExercisesSection = {
    title: 'Core',
    data: exercises.filter(
      (exercise) => exercise.muscleGroup === MuscleGroup.CORE,
    ),
  };

  const cardioExercisesSection = {
    title: 'Cardio',
    data: exercises.filter(
      (exercise) => exercise.muscleGroup === MuscleGroup.CARDIO,
    ),
  };

  const sections = useMemo(() => {
    if (!search) {
      return [
        chestExercisesSection,
        backExercisesSection,
        armExercisesSection,
        shouldersExercisesSection,
        legsExercisesSection,
        coreExercisesSection,
        cardioExercisesSection,
      ];
    }

    const filteredExercises = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(search.toLowerCase()),
    );

    const filteredChestExercisesSection = {
      title: 'Chest',
      data: filteredExercises.filter(
        (exercise) => exercise.muscleGroup === MuscleGroup.CHEST,
      ),
    };

    const filteredBackExercisesSection = {
      title: 'Back',
      data: filteredExercises.filter(
        (exercise) => exercise.muscleGroup === MuscleGroup.BACK,
      ),
    };

    const filteredArmExercisesSection = {
      title: 'Arms',
      data: filteredExercises.filter(
        (exercise) => exercise.muscleGroup === MuscleGroup.ARMS,
      ),
    };

    const filteredShoulderExercisesSection = {
      title: 'Shoulders',
      data: filteredExercises.filter(
        (exercise) => exercise.muscleGroup === MuscleGroup.SHOULDERS,
      ),
    };

    const filteredLegsExercisesSection = {
      title: 'Legs',
      data: filteredExercises.filter(
        (exercise) => exercise.muscleGroup === MuscleGroup.LEGS,
      ),
    };

    const filteredCoreExercisesSection = {
      title: 'Core',
      data: filteredExercises.filter(
        (exercise) => exercise.muscleGroup === MuscleGroup.CORE,
      ),
    };

    const filteredCardioExercisesSection = {
      title: 'Cardio',
      data: filteredExercises.filter(
        (exercise) => exercise.muscleGroup === MuscleGroup.CARDIO,
      ),
    };

    return [
      filteredChestExercisesSection,
      filteredBackExercisesSection,
      filteredArmExercisesSection,
      filteredShoulderExercisesSection,
      filteredLegsExercisesSection,
      filteredCoreExercisesSection,
      filteredCardioExercisesSection,
    ];
  }, [search, exercises, selectedExerciseIds]);

  const onCheckmarkPress = () => {
    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    const selectedExercises: ExerciseDisplay[] = exercises
      .filter((exercise) => selectedExerciseIds.includes(exercise.id))
      .map((exercise) => {
        const firstSet: ExerciseSetDisplay = {
          id: uuid.v4(),
          weight: 0,
          reps: 0,
          distance: 0,
          time: 0,
          completed: false,
        };

        const exerciseObject: ExerciseDisplay = {
          ...BASE_EXERCISE_DISPLAY,
          id: uuid.v4(),
          tags: exercise.tags,
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          sets: [firstSet],
        };

        return exerciseObject;
      });

    printExerciseDisplays(selectedExercises);

    if (isActiveWorkout === 'true') {
      setWorkout((prevWorkout) => {
        const newExercises = [
          ...prevWorkout.exercises,
          ...selectedExercises,
        ] as ExerciseDisplay[];

        return {
          ...prevWorkout,
          exercises: newExercises,
        };
      });
    } else {
      setWorkoutDisplay((prevWorkout) => {
        const newExercises = [
          ...prevWorkout.exercises,
          ...selectedExercises,
        ] as ExerciseDisplay[];

        return {
          ...prevWorkout,
          exercises: newExercises,
        };
      });
    }

    router.back();
  };

  return (
    <SafeAreaView className="relative w-full h-full justify-start items-start bg-offWhite">
      {selectedExerciseIds.length > 0 ? (
        <TouchableOpacity
          className="absolute bottom-10 right-10 z-50"
          onPress={onCheckmarkPress}
          testID="checkmark-button"
        >
          <View className="flex-row justify-center items-center bg-blue w-16 h-16 rounded-full shadow shadow-black">
            <Ionicons name="checkmark" size={30} color="white" />
          </View>
        </TouchableOpacity>
      ) : null}

      <FlatList
        data={sections}
        style={{ width: '100%' }}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={
          <View className="px-6 pt-8 mb-4">
            <TouchableOpacity onPress={() => router.back()} className="mb-5">
              <Ionicons name="close-outline" size={35} color="black" />
            </TouchableOpacity>
            <Text className="text-3xl font-medium mb-2">Add exercises</Text>

            {/* <Text className="text-md font-medium">ALL EXERCISES</Text> */}

            <TextInput
              placeholder="Search exercises"
              className="w-full h-12 px-4 mt-2 bg-white rounded"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        }
        renderItem={({ item: section }) => (
          <View>
            <Text className="text-lg font-medium mb-2 px-6">
              {section.title}
            </Text>

            <FlatList
              data={section.data}
              keyExtractor={(item) => item.id}
              renderItem={({ item: exercise }) => (
                <TouchableOpacity
                  onPress={() => onExercisePress(exercise.id)}
                  testID={`exercise-${exercise.name}`}
                >
                  <View
                    className={clsx('justify-center items-start py-2', {
                      'bg-blue': exercise.selected,
                    })}
                    data-selected={exercise.selected}
                  >
                    <View className="px-10">
                      <Text
                        className={clsx('py-2', {
                          'text-white': exercise.selected,
                        })}
                      >
                        {exercise.name}
                      </Text>
                      {/* <Text
                        className={clsx('font-semibold', {
                          'text-white': exercise.selected,
                        })}
                      >
                        {exercise.muscleGroup}
                      </Text> */}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View className="h-1" />}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListFooterComponent={() => <View className="h-10" />}
      />
    </SafeAreaView>
  );
};

export default AddExercises;
