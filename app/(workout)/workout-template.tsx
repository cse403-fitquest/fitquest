import FQButton from '@/components/FQButton';
import FQModal from '@/components/FQModal';
import { deleteWorkoutTemplate } from '@/services/workout';
import { useGeneralStore } from '@/store/general';
import { useUserStore } from '@/store/user';
import { useWorkoutStore } from '@/store/workout';
import { ExerciseTag } from '@/types/workout';
import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { ReactNode, useState } from 'react';
import { Text, TouchableOpacity, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { v4 as uuidv4 } from 'uuid';

const WorkoutTemplate = () => {
  const { workout } = useWorkoutStore();
  const { user, setUser } = useUserStore();
  const { setLoading } = useGeneralStore();

  const [setModalVisible, setSetModalVisible] = useState(false);
  const [setModalContent, setSetModalContent] = useState<{
    title: string;
    content: ReactNode;
    confirmText: string;
    onConfirm: () => void;
  }>({
    title: '',
    content: null,
    confirmText: '',
    onConfirm: () => {},
  });

  // useEffect(() => {
  //   setTemplate(EXERCISES_STUB);
  // }, []);

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

    const hourIndex = date.getHours();
    let hour = hourIndex.toString();
    if (hourIndex < 10) {
      hour = `0${hourIndex}`;
    }

    const minuteIndex = date.getMinutes();
    let minute = minuteIndex.toString();
    if (minuteIndex < 10) {
      minute = `0${minuteIndex}`;
    }

    return `${day}, ${month} ${date.getDate()}, ${date.getFullYear()} at ${hour}:${minute}`;
  };

  const onEditTemplatePress = () => {
    // Navigate to the edit template screen
    router.push('/edit-workout-template' as Href);
  };

  const onDeleteTemplatePress = () => {
    setSetModalContent({
      title: 'Delete Template',
      content: (
        <Text className="pt-1">
          Are you sure you want to delete this template? This action cannot be
          undone.
        </Text>
      ),
      confirmText: 'DELETE',
      onConfirm: () => {
        handleDeleteTemplate();
        setSetModalVisible(false);
      },
    });

    setSetModalVisible(true);
  };

  const handleDeleteTemplate = async () => {
    // Delete the template
    if (!user) return;

    setLoading(true);

    const updatedTemplates = user.savedWorkoutTemplates.filter(
      (template) => template.id !== workout.id,
    );

    const oldUser = { ...user };
    setUser({
      ...user,
      savedWorkoutTemplates: updatedTemplates,
    });

    // Update the user's saved workout templates
    const response = await deleteWorkoutTemplate(user.id, workout.id);

    setLoading(false);

    if (!response.success) {
      // Revert the changes
      setUser(oldUser);
      console.error('Error deleting workout template:', response.error);
      return;
    }

    // Navigate back to the workout screen
    router.back();
  };

  const onPerformWorkoutPress = () => {
    // Navigate to the workout screen
    router.push('/new-workout' as Href);
  };

  return (
    <SafeAreaView className="relative w-full h-full justify-start items-start bg-offWhite ">
      <FQModal
        visible={setModalVisible}
        setVisible={setSetModalVisible}
        title={setModalContent.title}
        confirmText={setModalContent.confirmText}
        onConfirm={setModalContent.onConfirm}
        onCancel={() => setSetModalVisible(false)}
        cancelText="CANCEL"
        width={300}
      >
        {setModalContent.content}
      </FQModal>

      <FlatList
        data={[]}
        renderItem={() => null}
        style={{ width: '100%' }}
        ListHeaderComponent={
          <View className="relative w-full h-full justify-start items-start px-6 pt-8">
            <View className="mb-5 w-full flex-row justify-between items-center">
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={35} color="black" />
              </TouchableOpacity>
              <View className="flex-row items-center">
                <TouchableOpacity onPress={onEditTemplatePress}>
                  <Text className="font-semibold text-blue p-1">EDIT</Text>
                </TouchableOpacity>
                {!workout.isSuggested ? (
                  <TouchableOpacity
                    className="ml-5"
                    onPress={onDeleteTemplatePress}
                  >
                    <Text className="font-semibold text-red-500 p-1">
                      DELETE
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
            <Text className="w-full text-3xl font-semibold mb-2">
              {workout.name}
            </Text>
            <Text className="text-grayDark text-sm mb-8">
              {turnDateIntoString(new Date())}
            </Text>

            <FlatList
              data={workout.exercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item: exercise }) => (
                <View className="w-full mb-8">
                  <Text className="text-lg font-semibold mb-2">
                    {exercise.name}
                  </Text>
                  <Text className="text-grayDark text-sm mb-2">
                    {exercise.muscleGroup}
                  </Text>
                  <FlatList
                    data={exercise.sets}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item: set, index: setIndex }) => {
                      if (
                        exercise.tags.includes(ExerciseTag.WEIGHT) &&
                        exercise.tags.includes(ExerciseTag.REPS)
                      ) {
                        // Weight and reps
                        return (
                          <View className="flex flex-row justify-start items-center w-full mb-2">
                            <Text className="mr-5 text-lg font-semibold">
                              {setIndex + 1}
                            </Text>
                            <Text className="text-lg">
                              {set.weight} lbs x {set.reps} reps
                            </Text>
                          </View>
                        );
                      } else if (
                        exercise.tags.includes(ExerciseTag.REPS) &&
                        exercise.tags.length === 1
                      ) {
                        // Reps only
                        return (
                          <View className="flex flex-row justify-start items-center w-full mb-2">
                            <Text className="mr-5 text-lg font-semibold">
                              {setIndex + 1}
                            </Text>
                            <Text className="text-lg">{set.reps} reps</Text>
                          </View>
                        );
                      } else if (
                        exercise.tags.includes(ExerciseTag.DISTANCE) &&
                        exercise.tags.includes(ExerciseTag.TIME)
                      ) {
                        // Distance and time
                        return (
                          <View className="flex flex-row justify-start items-center w-full mb-2">
                            <Text className="mr-5 text-lg font-semibold">
                              {setIndex + 1}
                            </Text>
                            <Text className="text-lg">
                              {set.distance} miles in {set.time} minutes
                            </Text>
                          </View>
                        );
                      } else if (
                        exercise.tags.includes(ExerciseTag.TIME) &&
                        exercise.tags.length === 1
                      ) {
                        // Time only
                        return (
                          <View className="flex flex-row justify-start items-center w-full mb-2">
                            <Text className="mr-5 text-lg font-semibold">
                              {setIndex + 1}
                            </Text>
                            <Text className="text-lg">{set.time} minutes</Text>
                          </View>
                        );
                      }

                      return <View />;
                    }}
                  />
                </View>
              )}
            />
            <View className="w-full mb-8">
              <FQButton onPress={onPerformWorkoutPress}>
                PERFORM WORKOUT
              </FQButton>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default WorkoutTemplate;