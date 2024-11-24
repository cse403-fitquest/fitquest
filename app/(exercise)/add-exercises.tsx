import { ALL_EXERCISES_STUB } from '@/constants/workout';
import { Exercise } from '@/types/workout';
import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

type ExerciseDisplay = Exercise & {
  selected: boolean;
};

const AddExercises = () => {
  const [exercises, setExercises] = useState<ExerciseDisplay[]>([]);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);

  useEffect(() => {
    setExercises(
      ALL_EXERCISES_STUB.map((exercise) => ({
        ...exercise,
        id: uuidv4(),
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

  return (
    <SafeAreaView className="relative w-full h-full justify-start items-start bg-offWhite">
      {selectedExerciseIds.length > 0 ? (
        <TouchableOpacity className="absolute bottom-10 right-10">
          <View className="flex-row justify-center items-center bg-blue w-16 h-16 rounded-full">
            <Ionicons name="checkmark" size={30} color="white" />
          </View>
        </TouchableOpacity>
      ) : null}

      <FlatList
        data={exercises}
        style={{ width: '100%' }}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-6 pt-8 mb-4">
            <TouchableOpacity onPress={() => router.back()} className="mb-5">
              <Ionicons name="close-outline" size={35} color="black" />
            </TouchableOpacity>
            <Text className="text-3xl font-medium mb-2">Add exercises</Text>

            <Text className="text-md font-medium">ALL EXERCISES</Text>
          </View>
        }
        renderItem={({ item: exercise }) => (
          <TouchableOpacity onPress={() => onExercisePress(exercise.id)}>
            <View
              className={clsx('justify-center items-start py-2', {
                'bg-blue': exercise.selected,
              })}
            >
              <View className="px-10">
                <Text
                  className={clsx({
                    'text-white': exercise.selected,
                  })}
                >
                  {exercise.name}
                </Text>
                <Text
                  className={clsx('font-semibold', {
                    'text-white': exercise.selected,
                  })}
                >
                  {exercise.muscleGroup}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View className="h-1" />}
      />
    </SafeAreaView>
  );
};

export default AddExercises;
