import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  // Modal,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  addToUserWorkouts,
  secondsToMinutes,
  updateUserAfterExpGain,
} from '@/utils/workout';
import { updateEXP, updateWorkouts } from '@/services/workout';
import { useUserStore } from '@/store/user';
import FQModal from '@/components/FQModal';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { Exercise, ExerciseTag, WorkoutTemplate } from '@/types/workout';
import FQButton from '@/components/FQButton';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { SUGGESTED_TEMPLATES } from '@/constants/workout';
//import { ExerciseTag } from '@/types/user';

const Workout = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const { user, setUser } = useUserStore();
  const [expGainModalVisible, setExpGainModalVisible] = useState(false);
  const [expGainModalData, setExpGainModalData] = useState<{
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
  const userID = user.id;
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(
    null,
  );

  //const fillerex: Exercise = { name: 'Bench Press', weight: 135, reps: 20, sets: 4, distance: 0, duration: 0, tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS] };

  const fillerexbench: Exercise = {
    id: 'sdoffgdn',
    name: 'Bench Press',
    sets: [
      {
        id: 'opijowiejfoiwn23049u203fj08n',
        weight: 135,
        reps: 500,
        distance: 0,
        time: 0,
      },
    ],
    muscleGroup: 'chest',
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
  };
  const fillerexsquat: Exercise = {
    id: 'sdgjonsdosdsfig',
    muscleGroup: 'legs',
    name: 'Squat',
    sets: [],
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
  };
  const fillerexlandmine: Exercise = {
    id: 'sdgjofgdnsdofig',
    muscleGroup: 'legs',
    name: 'Landmine Press',
    sets: [],
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
  };
  const fillerexdeadlift: Exercise = {
    id: 'sdgjonsd54gofig',
    muscleGroup: 'legs',
    name: 'Deadlift',
    sets: [],
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
  };
  const fillerexpushup: Exercise = {
    id: 'sdgjonafadfsdofig',
    muscleGroup: 'chest',
    name: 'Push Up',
    sets: [],
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
  };
  const fillerexpulldown: Exercise = {
    id: 'sdgjonsdfsfsfofig',
    muscleGroup: 'legs',
    name: 'Lat Pulldown',
    sets: [],
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
  };
  const fillerexbicep: Exercise = {
    id: 'sdgjonsafscdofig',
    muscleGroup: 'biceps',
    name: 'Bicep Curl',
    sets: [],
    tags: [ExerciseTag.WEIGHT, ExerciseTag.REPS],
  };
  const fillerexercises: Exercise[] = [
    fillerexbench,
    fillerexbicep,
    fillerexdeadlift,
    fillerexlandmine,
    fillerexpulldown,
    fillerexpushup,
    fillerexsquat,
  ];

  // const fillerworkout = [fillerex, fillerex, fillerex, fillerex];
  const fillerworkoutsuggest: WorkoutTemplate = {
    title: 'Whole Body Day',
    exercises: [fillerexpushup, fillerexbicep, fillerexsquat],
    startedAt: new Date(),
    duration: 500,
  };
  //const suggestedTemplates: Template[] = [fillerworkoutsuggest];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<WorkoutTemplate[]>(
    user.savedWorkouts,
  );
  const [suggestedTemplates /*setSuggestedTemplates*/] = useState<
    WorkoutTemplate[]
  >([fillerworkoutsuggest]);

  const [currtitle, setTitle] = useState('new workout');
  //const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [, /*editingTemplate,*/ seteditingTemplate] = useState(false);
  const [, /*editedTemplate,*/ seteditedTemplate] = useState<string>('');
  const [removeConfirmationVisible, setremoveConfirmationVisible] =
    useState(false);

  // const [viewedTemplate, setViewedTemplate] = useState<number | null>(null);

  // adds to selected
  // const addExercise = (exercise: Exercise) => {
  //   console.log('Added ' + exercise.name + ' to selected exercises');
  //   if (!selectedExercises.includes(exercise)) {
  //     setSelectedExercises([...selectedExercises, exercise]);
  //   }
  //   console.log(selectedExercises);
  // };

  // removes from selected
  // const removeExercise = (name: string) => {
  //   console.log('Removed ' + name + ' from selected exercises');
  //   setSelectedExercises(
  //     selectedExercises.filter((item) => item.name !== name),
  //   );
  // };
  // const updateExercise = (index: number, key: string, value: number) => {
  //   // Update the specific property (weight, reps, sets) of the exercise
  //   const updatedExercises: Exercise[] = [...selectedExercises];
  //   if (key === 'weight') {
  //     updatedExercises[index].weight = value;
  //   }
  //   if (key === 'reps') {
  //     updatedExercises[index].reps = value;
  //   }
  //   if (key === 'sets') {
  //     updatedExercises[index].sets = value;
  //   }
  //   setSelectedExercises(updatedExercises);
  // };

  //finds exercise in exercises with name name
  const findExercise = (name: string, exercises: Exercise[]) => {
    if (!exercises.map((exercise) => exercise.name).includes(name)) {
      throw new Error('Exercise with name ' + name + ' not found');
    }
    // Find the exercise by name in the exercises array
    const exercise = exercises.find((exercise) => exercise.name === name);

    // If exercise is not found, throw an error
    if (!exercise) {
      throw new Error(
        'Exercise with name ' + name + ' not found in exercises list',
      );
    }

    console.log('exercise: ' + exercise.name + ' found');
    // Return the found exercise
    return exercise;
  };
  // const findTemplateIndex = (title: string): number => {
  //   // Find the index of the template by title
  //   const index = savedTemplates.findIndex(
  //     (template) => template.title === title,
  //   );

  //   // If index is -1, the template was not found, throw an error
  //   // if (index === -1) {
  //   //   throw new Error('Template with title "' + title + '" not found');
  //   // }

  //   console.log('Template: "' + title + '" found at index: ' + index);
  //   // Return the index of the found template
  //   return index;
  // };

  const closeTemplateCreator = () => {
    console.log('template creator closed');
    setSelectedExercises([]);
    seteditingTemplate(false);
    setModalVisible(false);
  };

  // const openTemplate = () => {
  //   setSelectedExercises(selectedExercises);
  //   setTitle(title);
  // };

  const exerciseToString = (exercise: Exercise) => {
    return (
      exercise.name +
      '                ' +
      // exercise.weight +
      // '                ' +
      // exercise.reps +
      // '                ' +
      exercise.sets +
      '  '
    );
  };
  const exercisesToString = (exercises: Exercise[]) => {
    const str = [];
    for (const exercise of exercises) {
      str.push(exerciseToString(exercise));
    }
    return str;
  };

  const toggleSelection = (index: number) => {
    setSelectedTemplate((prevSelected) =>
      prevSelected === index ? null : index,
    );
  };
  // const toggleViewDropdown = (index: number) => {
  //   setViewedTemplate((prevViewed) => (prevViewed === index ? null : index));
  // };
  //old workout stuff
  {
    /*setSavedTemplates((prevTemplates) => {
      // const existingIndex = prevTemplates.findIndex(
      //   (template) => template.title === workout.title,
      // );

      //if user is editing
      if (editingTemplate) {
        // Update existing workout
        const updatedTemplates = [...prevTemplates];
        //if the template is a suggested template
        if (findTemplateIndex(editedTemplate) === -1) {
          console.log(
            'Successfully added ' + workout.title + ' to saved templates',
          );
          seteditingTemplate(false);
          return [...prevTemplates, workout];
        }
        updatedTemplates[findTemplateIndex(editedTemplate)] = workout;
        console.log('Updated existing workout: ' + workout.title);
        seteditingTemplate(false);
        return updatedTemplates;
        // if user is adding a new workout
      } else {
        //if the workout with same name is already in my templates
        if (
          savedTemplates
            .map((template) => template.title)
            .includes(workout.title)
        ) {
          throw new Error(
            'Workout with title: ' + workout.title + ' already exists',
          );
        }
        console.log(
          'Successfully added ' + workout.title + ' to saved templates',
        );
        seteditingTemplate(false);
        return [...prevTemplates, workout];
      }
    });

    setSelectedExercises([]);
    setModalVisible(false);*/
  }

  //constructor for a Template
  const Template = ({
    title,
    exercises,
    isSelected,
    isSaved,
    toggleSelection,
  }: {
    title: string;
    exercises: Exercise[];
    isSelected: boolean;
    isSaved: boolean;
    toggleSelection: () => void;
  }) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
      setDropdownVisible(!isDropdownVisible); // Simplified toggle for debugging
      console.log('Dropdown visibility set to: ', !isDropdownVisible);
    };

    const editTemplate = () => {
      console.log('opened template editor: ' + title);
      setSelectedExercises(exercises);
      setTitle(title);
      seteditingTemplate(true);
      seteditedTemplate(title);
      setModalVisible(true);
    };
    //takes name of workout and removes it from the saved templates
    const openRemoveConfirmation = () => {
      console.log('Opened remove confirmation');
      setTitle(title);
      setremoveConfirmationVisible(true);
    };
    const confirmRemove = () => {
      console.log('Removed ' + currtitle + ' from saved templates');
      setremoveConfirmationVisible(false);
      setSavedTemplates(
        savedTemplates.filter((item) => item.title !== currtitle),
      );
    };

    return (
      <View>
        <View style={templatestyles.box}>
          <TouchableOpacity
            style={templatestyles.circle}
            onPress={toggleSelection}
          >
            {isSelected && <View style={templatestyles.innerCircle} />}
          </TouchableOpacity>

          <Text style={templatestyles.title}>{title}</Text>
          <TouchableOpacity
            style={templatestyles.viewButton}
            onPress={() => toggleDropdown()}
          >
            <Text style={templatestyles.buttonText}>View</Text>
          </TouchableOpacity>
        </View>
        {removeConfirmationVisible && (
          <Modal transparent={true} animationType="fade">
            <View style={templatestyles.modalContainer}>
              <View style={templatestyles.modalBox}>
                <Text style={templatestyles.modalText}>Are you sure?</Text>
                <View style={templatestyles.buttonContainer}>
                  <TouchableOpacity
                    style={templatestyles.purplebutton}
                    onPress={() => setremoveConfirmationVisible(false)}
                  >
                    <Text style={templatestyles.buttonText}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={templatestyles.redbutton}
                    onPress={() => confirmRemove()}
                  >
                    <Text style={templatestyles.buttonText}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
        {isDropdownVisible && (
          <View style={templatestyles.dropdownContainer}>
            <View className="w-full mt-5 flex-row justify-between items-center">
              <Text style={templatestyles.dropdownItem}>
                {' '}
                Name | Weight | Reps | Sets{' '}
              </Text>
              {/*button to edit the template*/}
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => editTemplate()}
              >
                <Text style={{ fontWeight: 'bold', color: 'purple' }}>
                  Edit
                </Text>
              </TouchableOpacity>

              {/*button to delete the template*/}
              {isSaved && (
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => openRemoveConfirmation()}
                >
                  <Text style={{ fontWeight: 'bold', color: 'red' }}>
                    Remove
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={exercisesToString(exercises)}
              keyExtractor={(item, index) => item + '' + index}
              renderItem={({ item }) => (
                <Text style={templatestyles.dropdownItem}>{item}</Text>
              )}
              nestedScrollEnabled={true}
            />
          </View>
        )}
      </View>
    );
  };

  // to swap between starting and stopping workouts
  const toggleWorkout = () => {
    if (isWorkoutActive) {
      stopWorkout();
    } else {
      startWorkout();
    }
    //setIsWorkoutActive(!isWorkoutActive);
    console.log(
      isWorkoutActive
        ? 'workout ended, final time: ' + secondsToMinutes(secondsElapsed)
        : 'workout started',
    );
  };

  // when workout is started
  const startWorkout = () => {
    if (!isWorkoutActive) {
      setIsWorkoutActive(true);
      setSecondsElapsed(0); // Reset the timer whenever a new workout starts
      const newTimer = setInterval(() => {
        setSecondsElapsed((prevSeconds) => prevSeconds + 1);
      }, 1000);
      setTimer(newTimer); // Store the timer ID
    }
  };

  // when workout is stopped
  const stopWorkout = async () => {
    if (isWorkoutActive) {
      setIsWorkoutActive(false);
      if (timer) {
        const oldUser = user;
        const expGain = secondsElapsed * 500;
        const userAfterExpGain = updateUserAfterExpGain(user, expGain);

        setUser(userAfterExpGain);

        clearInterval(timer); // Stop the timer
        setTimer(null); // Clear the timer ID

        if (oldUser.attributePoints < userAfterExpGain.attributePoints) {
          setExpGainModalData({
            type: 'levelUp',
            title: 'You have leveled up!',
            expGain: expGain,
            description:
              'You have leveled up. Go to your profile screen to allocate your attribute points.',
          });
        } else {
          setExpGainModalData({
            type: 'expGain',
            title: 'You gained EXP!',
            expGain: expGain,
            description: 'You have gained experience points!',
          });
        }

        setExpGainModalVisible(true);

        const updateExpResponse = await updateEXP(userID, secondsElapsed); //update user exp

        if (updateExpResponse.success) {
          console.log('Exp updated successfully');
        } else {
          console.error('Error updating exp', updateExpResponse.error);

          // Revert user back to old user if update fails
          setUser(oldUser);

          // Close the level up modal if it was opened
          setExpGainModalVisible(false);

          // Show error message
          Alert.alert('Error updating exp');
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      // Clear the timer when the component is unmounted
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  const addWorkout = () => {
    setModalVisible(true);
    setTitle('new workout');
  };

  ///////////////////////// for template creation ///////////////////////////////

  // const CreateTemplateScreen = ({
  //   // title,
  //   exercises,
  // }: {
  //   title: string;
  //   exercises: Exercise[];
  // }) => {
  //   const saveWorkout = async () => {
  //     const oldUser = user;
  //     const newWorkout: WorkoutTemplate = {
  //       title: chosenTitle,
  //       startedAt: new Date(),
  //       exercises: [],
  //       duration: 0,
  //     };
  //     const userAfterTemplateAdd = addToUserWorkouts(user, newWorkout);

  //     setUser(userAfterTemplateAdd);

  //     const addTemplateResponse = await updateWorkouts(userID, newWorkout); //update user exp

  //     if (addTemplateResponse.success) {
  //       console.log('workouts updated successfully');
  //     } else {
  //       console.error('Error updating workouts', addTemplateResponse.error);

  //       // Revert user back to old user if update fails
  //       setUser(oldUser);

  //       // Show error message
  //       Alert.alert('Error updating workouts');
  //     }
  //     seteditingTemplate(false);
  //     setSavedTemplates(userAfterTemplateAdd.savedWorkouts);
  //     setSelectedExercises([]);
  //     setModalVisible(false);
  //   };
  //   const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([
  //     ...exercises,
  //   ]); // Add this if it's local state
  //   const [chosenTitle, setChosenTitle] = useState(currtitle); // Add this if it's local state
  //   const [isEditingTitle, setIsEditingTitle] = useState(false);

  //   // Add exercise to the selected list without triggering a full re-render
  //   const addExercise = (exercise: Exercise) => {
  //     console.log('Added ' + exercise.name + ' to selected exercises');
  //     if (!selectedExercises.includes(exercise)) {
  //       setSelectedExercises([...selectedExercises, exercise]);
  //     }
  //     console.log(selectedExercises);
  //   };

  //   // // Update exercise details
  //   // const updateExerciseWeight = (index: number, value: number) => {
  //   //   const updatedExercises: Exercise[] = [...selectedExercises];
  //   //   updatedExercises[index].weight = value;
  //   //   setSelectedExercises(updatedExercises);
  //   // };
  //   // const updateExerciseReps = (index: number, value: number) => {
  //   //   const updatedExercises: Exercise[] = [...selectedExercises];
  //   //   updatedExercises[index].reps = value;
  //   //   setSelectedExercises(updatedExercises);
  //   // };

  //   // const updateExerciseSets = (index: number, value: number) => {
  //   //   const updatedExercises: Exercise[] = [...selectedExercises];
  //   //   updatedExercises[index].sets = value;
  //   //   setSelectedExercises(updatedExercises);
  //   // };

  //   // const updateTitle = (value: string) => {
  //   //   setChosenTitle(value);
  //   // };

  //   const removeExercise = useCallback(
  //     (exerciseName: string) => {
  //       setSelectedExercises((prevSelected) =>
  //         prevSelected.filter((exercise) => exercise.name !== exerciseName),
  //       );
  //     },
  //     [], // Memoized function
  //   );

  //   return (
  //     <SafeAreaView className="flex-1 items-left justify-left h-full bg-offWhite ">
  //       <FlatList
  //         data={[]}
  //         renderItem={() => null}
  //         ListHeaderComponent={
  //           <View>
  //             <Text style={templatestyles.modalCreatorHeader}>
  //               Template Creator
  //             </Text>
  //             {/* Editable Title */}
  //             <View style={templatestyles.titleContainer}>
  //               {isEditingTitle ? (
  //                 <TextInput
  //                   style={templatestyles.titleInput}
  //                   value={chosenTitle}
  //                   onChangeText={(text) => setChosenTitle(text)}
  //                   onBlur={() => setIsEditingTitle(false)} // Exit edit mode on blur
  //                   autoFocus
  //                 />
  //               ) : (
  //                 <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
  //                   <Text style={templatestyles.titleText}>{chosenTitle}</Text>
  //                 </TouchableOpacity>
  //               )}
  //             </View>

  //             {/* Available Exercises */}
  //             <View style={{ flex: 1, marginBottom: 10 }}>
  //               <Text style={templatestyles.sectionTitle}>
  //                 Available Exercises
  //               </Text>
  //               <FlatList
  //                 data={fillerexercises.map((exercise) => exercise.name)}
  //                 keyExtractor={(item) => item}
  //                 renderItem={({ item }) => (
  //                   <View style={templatestyles.exerciseItem}>
  //                     <TouchableOpacity
  //                       style={templatestyles.addButton}
  //                       onPress={() =>
  //                         addExercise(findExercise(item, fillerexercises))
  //                       }
  //                     >
  //                       <Text style={templatestyles.addButtonText}>+</Text>
  //                     </TouchableOpacity>
  //                     <Text> {item}</Text>
  //                   </View>
  //                 )}
  //                 contentContainerStyle={{ paddingBottom: 20 }}
  //               />
  //             </View>

  //             {/* Selected Exercises */}
  //             <Text style={templatestyles.sectionTitle}>
  //               Selected Exercises
  //             </Text>
  //             <View
  //               style={{ flex: 1, marginBottom: 10, alignItems: 'flex-start' }}
  //             >
  //               <Text style={templatestyles.templateCreatorTableHeader}>
  //                 | Name | Weight | Reps | Sets |
  //               </Text>
  //               <FlatList
  //                 data={selectedExercises}
  //                 keyExtractor={(item) => item.name}
  //                 renderItem={({ item }) => (
  //                   <View style={templatestyles.exerciseItem}>
  //                     <TouchableOpacity
  //                       style={templatestyles.removeButton}
  //                       onPress={() => removeExercise(item.name)}
  //                     >
  //                       <Text style={templatestyles.addButtonText}>-</Text>
  //                     </TouchableOpacity>
  //                     <Text> {item.name}</Text>
  //                     {/* Weight input */}
  //                     {/*<TextInput
  //                       style={templatestyles.input}
  //                       placeholder="Weight"
  //                       value={item.weight.toString()}
  //                       keyboardType="numeric"
  //                       onChangeText={(value) =>
  //                         updateExerciseWeight(index, +value)
  //                       }
  //                     />
  //                     <TextInput
  //                       style={templatestyles.input}
  //                       placeholder="Reps"
  //                       value={item.reps.toString()}
  //                       keyboardType="numeric"
  //                       onChangeText={(value) =>
  //                         updateExerciseReps(index, +value)
  //                       }
  //                     />
  //                     <TextInput
  //                       style={templatestyles.input}
  //                       placeholder="Sets"
  //                       value={item.sets.toString()}
  //                       keyboardType="numeric"
  //                       onChangeText={(value) =>
  //                         updateExerciseSets(index, +value)
  //                       }
  //                     />*/}
  //                   </View>
  //                 )}
  //                 contentContainerStyle={{ paddingBottom: 20 }}
  //               />
  //             </View>
  //           </View>
  //         }
  //       />
  //       {/* Footer Buttons */}
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           justifyContent: 'space-between',
  //           width: '100%',
  //         }}
  //       >
  //         <TouchableOpacity
  //           style={templatestyles.closeButton}
  //           onPress={() => closeTemplateCreator()} // Close modal
  //         >
  //           <Text style={templatestyles.closeButtonText}>Close</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={templatestyles.saveButton}
  //           onPress={saveWorkout} // Save and close modal
  //         >
  //           <Text style={templatestyles.closeButtonText}>
  //             Save to Templates
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </SafeAreaView>
  //   );
  // };

  ////////////////////// moving to return section //////////////////////

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
            <View className="flex-1 items-left justify-r h-full">
              <View className="mb-5">
                <Text className="text-xl text-grayDark font-bold mb-5">
                  QUICK START
                </Text>
                <View>
                  <FQButton>START AN EMPTY WORKOUT</FQButton>
                </View>
              </View>

              {/* Saved Templates Section */}
              <View className="w-full flex-row justify-between items-center">
                <Text className="text-xl text-grayDark font-bold mb-2">
                  MY TEMPLATES
                </Text>
                <TouchableOpacity onPress={() => addWorkout()}>
                  <Ionicons name="add" size={24} color={Colors.blue} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={savedTemplates}
                style={{ marginBottom: 20 }}
                keyExtractor={(_, index) => `template-${index}`}
                renderItem={({ item, index }) => (
                  <Template
                    title={item.title}
                    exercises={item.exercises}
                    isSelected={selectedTemplate === index}
                    isSaved={true}
                    toggleSelection={() => toggleSelection(index)}
                    //toggleViewDropdown={() => toggleViewDropdown(index)}
                  />
                )}
                ListEmptyComponent={
                  <View className="h-[50px] justify-center items-center">
                    <Text className="text-center text-grayDark">
                      You curently have no templates.
                    </Text>
                  </View>
                }
                nestedScrollEnabled={true}
              />

              {/* Suggested Templates Section */}
              <View className="w-full">
                <Text className="text-xl text-grayDark font-bold mb-2">
                  SUGGESTED TEMPLATES
                </Text>
                <FlatList
                  data={SUGGESTED_TEMPLATES}
                  keyExtractor={(_, index) => `template-${index}`}
                  renderItem={({ item: workoutTemplate }) => (
                    <View className="bg-white p-4 border-gray border rounded shadow-md shadow-black">
                      <Text className="text-lg font-semibold">
                        {workoutTemplate.title}
                      </Text>
                      {workoutTemplate.exercises.map((exercise) => (
                        <Text key={exercise.id}>
                          {exercise.sets.length}x {exercise.name}
                        </Text>
                      ))}
                    </View>
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

//styles for the templates
const templatestyles = StyleSheet.create({
  box: {
    width: 300,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light background
    padding: 20,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: 'purple',
    borderRadius: 25,
    padding: 10,
  },
  buttonText: {
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  dropdownContainer: {
    marginTop: 5,
    width: 300,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    backgroundColor: 'purple',
    width: 165,
    padding: 15,
    marginTop: 15,
    borderRadius: 40,
    alignItems: 'center',
  },
  buttonCreatorText: {
    color: 'white',
    fontSize: 18,
  },
  modalCreatorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCreatorContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
  },
  modalCreatorHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  templateCreatorTableHeader: {
    fontSize: 16,
    marginBottom: 10,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: 16,
    flex: 1,
  },
  addButton: {
    backgroundColor: 'green',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedExercise: {
    fontSize: 16,
    marginBottom: 5,
  },
  addtemplatebutton: {
    fontSize: 28,
    marginBottom: 5,
    marginRight: 65,
  },
  noExercisesText: {
    fontSize: 16,
    color: 'gray',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 20,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 20,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  titleContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  titleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    textAlign: 'center',
    padding: 5,
  },
  input: {
    height: 25,
    width: 45,
    marginLeft: 8,
    marginRight: 7,
    paddingHorizontal: 10,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalBox: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  redbutton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'red', // button color
    borderRadius: 5,
    alignItems: 'center',
  },
  purplebutton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'purple', // button color
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default Workout;
