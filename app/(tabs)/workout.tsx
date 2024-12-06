import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { FC, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@/store/user';
import FQModal from '@/components/FQModal';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { ExerciseDisplay, ExerciseSetDisplay, Workout } from '@/types/workout';
import FQButton from '@/components/FQButton';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { SUGGESTED_TEMPLATES } from '@/constants/workout';
import { Href, router } from 'expo-router';
import { useWorkoutStore } from '@/store/workout';
import { v4 as uuidv4 } from 'uuid';

const WorkoutScreen = () => {
  const { user } = useUserStore();
  const [expGainModalVisible, setExpGainModalVisible] = useState(false);
  const [expGainModalData] = useState<{
    type: 'levelUp' | 'expGain';
    title: string;
    expGain: number;
    description: string;
  }>({
    type: 'expGain',
    title: 'You gained EXP!',
    expGain: 0,
    description: 'You have gained experience points!',
  });

  if (!user) {
    throw new Error('User data not found.');
  }

  const [timer] = useState<ReturnType<typeof setInterval> | null>(null);

  const { workout, setWorkout, setWorkoutDisplay } = useWorkoutStore();

  useEffect(() => {
    return () => {
      // Clear the timer when the component is unmounted
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  const onAddWorkoutTemplateClick = () => {
    console.log('Add workout template clicked');

    setWorkoutDisplay(() => ({
      id: uuidv4(),
      name: 'New Workout Template',
      exercises: [],
      startedAt: new Date(),
    }));

    router.push('/edit-workout-template' as Href);
  };

  const onWorkoutTemplateClick = (workoutTemplate: Workout) => {
    console.log('Workout template clicked');

    const workoutExercises: ExerciseDisplay[] = workoutTemplate.exercises.map(
      (exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) => ({
          ...set,
          completed: false,
        })) as ExerciseSetDisplay[],
      }),
    );

    setWorkoutDisplay(() => ({
      id: workoutTemplate.id,
      name: workoutTemplate.title,
      exercises: workoutExercises,
      startedAt: new Date(),
    }));

    router.push('/workout-template' as Href);
  };

  const onSuggestedWorkoutTemplateClick = (workoutTemplate: Workout) => {
    console.log('Suggested workout template clicked');

    const workoutExercises: ExerciseDisplay[] = workoutTemplate.exercises.map(
      (exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) => ({
          ...set,
          completed: false,
        })) as ExerciseSetDisplay[],
      }),
    );

    setWorkoutDisplay(() => ({
      id: uuidv4(), // Generate a new ID for the workout if it's a suggested template
      name: workoutTemplate.title,
      exercises: workoutExercises,
      startedAt: new Date(),
      isSuggested: true,
    }));

    router.push('/workout-template' as Href);
  };

  return (
    <SafeAreaView className="flex-1 items-left justify-left h-full bg-offWhite ">
      <FQModal
        visible={expGainModalVisible}
        setVisible={setExpGainModalVisible}
        onConfirm={() => setExpGainModalVisible(false)}
        title={expGainModalData.title}
        confirmText="CLOSE"
        width={300}
      >
        <View>
          {expGainModalData.type === 'levelUp' ? (
            <View className="w-full relative items-center justify-center h-[140px] overflow-hidden">
              <View className="absolute bottom-0 flex-row justify-center items-end">
                <View className="relative">
                  <AnimatedSprite
                    id={user?.spriteID}
                    state={SpriteState.ATTACK_3}
                    width={120}
                    height={120}
                    duration={600}
                  />
                </View>
                <View className="relative">
                  <AnimatedSprite
                    id={AnimatedSpriteID.FIRE_SKULL_RED}
                    state={SpriteState.DAMAGED}
                    direction="left"
                    width={120}
                    height={120}
                    duration={600}
                    delay={200}
                  />
                </View>
              </View>
            </View>
          ) : null}
          <View className="mt-8 mb-8">
            <Text className="text-lg text-center font-bold">
              EXP GAIN:{' '}
              <Text className="text-yellow font-bold">
                {expGainModalData.expGain} XP
              </Text>
            </Text>
          </View>

          <Text>{expGainModalData.description} </Text>
        </View>
      </FQModal>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <View className="py-8 px-6">
            <Text className="text-2xl text-gray-black mb-5">Workout</Text>
            <View className="mb-6">
              <Text className="text-xl text-grayDark font-bold mb-4">
                RESUME WORKOUT
              </Text>
              <View className="w-full items-center justify-center">
                {workout.id ? (
                  <FQButton
                    className="w-full"
                    secondary
                    onPress={() => {
                      console.log('Resume workout');

                      router.push('/new-workout' as Href);
                    }}
                  >
                    RESUME ACTIVE WORKOUT
                  </FQButton>
                ) : (
                  <Text>You currently have no active workout</Text>
                )}
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xl text-grayDark font-bold mb-4">
                QUICK START
              </Text>
              <View>
                <FQButton
                  onPress={() => {
                    // TODO: Check if there is an active workout
                    // If there is an active workout, ask the user if they want to resume it
                    console.log('Start an empty workout');

                    setWorkout(() => ({
                      id: uuidv4(),
                      name: 'Empty Workout',
                      startedAt: new Date(),
                      exercises: [],
                    }));

                    router.push('/new-workout' as Href);
                  }}
                >
                  START AN EMPTY WORKOUT
                </FQButton>
              </View>
            </View>

            {/* Saved Templates Section */}
            <View className="mb-6">
              <View className="w-full flex-row justify-between items-center mb-4">
                <Text className="text-xl text-grayDark font-bold">
                  MY TEMPLATES
                </Text>
                <TouchableOpacity onPress={() => onAddWorkoutTemplateClick()}>
                  <Ionicons name="add" size={25} color={Colors.blue} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={user.savedWorkoutTemplates}
                keyExtractor={(workout) => workout.id}
                renderItem={({ item: workoutTemplate }) => (
                  <TouchableOpacity
                    onPress={() => onWorkoutTemplateClick(workoutTemplate)}
                  >
                    <Template workoutTemplate={workoutTemplate} />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View className="h-[50px] justify-center items-center">
                    <Text className="text-center text-grayDark">
                      You currently have no templates.
                    </Text>
                  </View>
                }
                ItemSeparatorComponent={() => <View className="h-5"></View>}
                nestedScrollEnabled={true}
              />
            </View>

            {/* Suggested Templates Section */}
            <View className="mb-6">
              <View className="w-full">
                <Text className="text-xl text-grayDark font-bold mb-4">
                  SUGGESTED TEMPLATES
                </Text>
                <FlatList
                  data={SUGGESTED_TEMPLATES}
                  keyExtractor={(workout) => workout.id}
                  renderItem={({ item: workoutTemplate }) => (
                    <TouchableOpacity
                      onPress={() =>
                        onSuggestedWorkoutTemplateClick(workoutTemplate)
                      }
                    >
                      <Template workoutTemplate={workoutTemplate} />
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View className="h-5"></View>}
                  nestedScrollEnabled={true}
                />
              </View>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const Template: FC<{ workoutTemplate: Workout }> = ({ workoutTemplate }) => {
  return (
    <View className="bg-white p-4 border-gray border rounded shadow-md shadow-black">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-semibold mb-2">
          {workoutTemplate.title}
        </Text>
        {/* <TouchableOpacity>
          <Ionicons name="pencil-outline" size={15} />
        </TouchableOpacity> */}
      </View>

      <FlatList
        data={workoutTemplate.exercises}
        keyExtractor={(exercise) => exercise.id}
        renderItem={({ item: exercise }) => (
          <Text key={exercise.id}>
            {exercise.sets.length}x {exercise.name}
          </Text>
        )}
        ItemSeparatorComponent={() => <View className="h-1"></View>}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

export default WorkoutScreen;
