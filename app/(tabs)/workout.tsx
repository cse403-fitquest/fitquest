import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Modal,
} from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { secondsToMinutes } from '@/utils/workout';
import { updateEXP } from '@/services/workout';
import { useUserStore } from '@/store/user';

const Workout = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const { user } = useUserStore();

  if (!user) {
    throw new Error('User data not found.');
  }
  const userID = user.id;
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(
    null,
  );

  type Exercise = { name: string; weight: number; reps: number; sets: number };

  const fillerex: Exercise = { name: 'Bench', weight: 135, reps: 20, sets: 4 };

  const fillerexbench: Exercise = {
    name: 'Bench Press',
    weight: 135,
    reps: 20,
    sets: 4,
  };
  const fillerexsquat: Exercise = {
    name: 'Squat',
    weight: 135,
    reps: 20,
    sets: 4,
  };
  const fillerexlandmine: Exercise = {
    name: 'Landmine Press',
    weight: 135,
    reps: 20,
    sets: 4,
  };
  const fillerexdeadlift: Exercise = {
    name: 'Deadlift',
    weight: 135,
    reps: 20,
    sets: 4,
  };
  const fillerexpushup: Exercise = {
    name: 'Push Up',
    weight: 135,
    reps: 20,
    sets: 4,
  };
  const fillerexpulldown: Exercise = {
    name: 'Lat Pulldown',
    weight: 135,
    reps: 20,
    sets: 4,
  };
  const fillerexbicep: Exercise = {
    name: 'Bicep Curl',
    weight: 135,
    reps: 20,
    sets: 4,
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

  const fillerworkout = [fillerex, fillerex, fillerex, fillerex];
  const fillerworkoutsuggest = [fillerex, fillerex, fillerex];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<Exercise[][]>([]);


  // adds to selected
  const addExercise = (exercise: Exercise) => {
    console.log('Added ' + exercise + ' to selected exercises');
    if (!selectedExercises.includes(exercise)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  // removes from selected
  const removeExercise = (name: string) => {
    console.log('Removed ' + name + ' from selected exercises');
    setSelectedExercises(
      selectedExercises.filter((item) => item.name !== name),
    );
  };

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

    // Return the found exercise
    return exercise;
  };

  const closeTemplateCreator = () => {
    console.log('template creator closed');
    setSelectedExercises([]);
    setModalVisible(false);
  };

  const exerciseToString = (exercise: Exercise) => {
    return (
      exercise.name +
      '                     ' +
      exercise.weight +
      '               ' +
      exercise.reps +
      '               ' +
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

  const saveWorkout = (workout: Exercise[]) => {
    setSavedTemplates([...savedTemplates, workout])
  }

  //constructor for a Template
  const Template = (title: string, exercises: Exercise[]) => {
    const [isSelected, setIsSelected] = useState(false);
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleSelection = () => {
      setIsSelected(!isSelected);
    };
    const toggleDropdown = () => {
      setDropdownVisible(!isDropdownVisible);
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
            onPress={toggleDropdown}
          >
            <Text style={templatestyles.buttonText}>View</Text>
          </TouchableOpacity>
        </View>

        {isDropdownVisible && (
          <View style={templatestyles.dropdownContainer}>
            <Text style={templatestyles.dropdownItem}>
              {' '}
              Name | Weight | Reps | Sets{' '}
            </Text>
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
  // TODO: DELETE LINE BELOW WHEN USING THE FUNCTION

  const stopWorkout = () => {
    if (isWorkoutActive) {
      setIsWorkoutActive(false);
      if (timer) {
        updateEXP(userID, secondsElapsed); //update user exp
        clearInterval(timer); // Stop the timer
        setTimer(null); // Clear the timer ID
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

  ///////////////////////// for template creation ///////////////////////////////

  const CreateTemplateScreen = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Allow modal to close on hardware back button on Android
      >
        <View style={templatestyles.modalOverlay}>
          <View style={[templatestyles.modalCreatorContent, { flex: 1 }]}>
            <Text style={templatestyles.modalCreatorHeader}>
              Template Creator
            </Text>

            {/* List of Exercises */}
            <View style={{ flex: 1, marginBottom: 10 }}>
              <Text style={templatestyles.sectionTitle}>
                Available Exercises
              </Text>

              {/*names of each of the exercises*/}
              <FlatList
                data={fillerexercises.map((exercise) => exercise.name)}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <View style={templatestyles.exerciseItem}>
                    <TouchableOpacity
                      style={templatestyles.addButton}
                      onPress={() =>
                        addExercise(findExercise(item, fillerexercises))
                      }
                    >
                      <Text style={templatestyles.addButtonText}>+</Text>
                    </TouchableOpacity>
                    <Text> {item}</Text>
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }} // Padding to avoid cutoff at bottom
              />
            </View>

            {/* Selected Exercises Section (initially empty) */}
            <Text style={templatestyles.sectionTitle}>Selected Exercises</Text>
            <View
              style={{ flex: 1, marginBottom: 10, alignItems: 'flex-start' }}
            >
              <FlatList
                data={selectedExercises.map((exercise) => exercise.name)}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <View style={templatestyles.exerciseItem}>
                    <TouchableOpacity
                      style={templatestyles.removeButton}
                      onPress={() => removeExercise(item)}
                    >
                      <Text style={templatestyles.addButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text> {item}</Text>
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }} // Padding to avoid cutoff at bottom
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <TouchableOpacity
                style={templatestyles.closeButton}
                onPress={() => closeTemplateCreator()} // Close modal
              >
                <Text style={templatestyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={templatestyles.saveButton}
                onPress={() => setModalVisible(false)} // Close modal
              >
                <Text style={templatestyles.closeButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  ////////////////////// moving to return section //////////////////////

  return (
    <SafeAreaView className="flex-1 items-left justify-left h-full bg-offWhite px-6">
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <View className="py-8">
            <Text className="text-2xl text-gray-black mb-5">Workout</Text>
            <View className="flex-1 items-left justify-r h-full">
              {/* Start/Stop Workout Button */}
              <TouchableOpacity
                onPress={toggleWorkout}
                style={{
                  backgroundColor: isWorkoutActive ? 'red' : 'purple',
                  width: 145,
                  padding: 15,
                  marginTop: 0,
                  borderRadius: 40,
                }}
              >
                <Text style={{ color: 'white', fontSize: 18 }}>
                  {isWorkoutActive ? 'Stop Workout' : 'Start Workout'}
                </Text>
              </TouchableOpacity>

              <Text style={{ marginLeft: 12 }}>
                Time Elapsed: {secondsToMinutes(secondsElapsed)}
              </Text>

              {/* Create Template Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: 'purple',
                  width: 165,
                  padding: 15,
                  marginTop: 15,
                  borderRadius: 40,
                }}
                onPress={() => setModalVisible(true)}
              >
                {CreateTemplateScreen()}
                <Text style={{ color: 'white', fontSize: 18 }}>
                  Create Template
                </Text>
              </TouchableOpacity>

              {/* Saved Templates Section */}
              <View className="w-full mt-5">
                <Text className="text-xl text-grayDark font-bold mb-2">
                  SAVED TEMPLATES
                </Text>
                {Template('doms push', fillerworkout)}
              </View>

              {/* Suggested Templates Section */}
              <View className="w-full mt-5">
                <Text className="text-xl text-grayDark font-bold mb-2">
                  SUGGESTED TEMPLATES
                </Text>
                  <FlatList
                    data={savedTemplates}
                    keyExtractor={(item, index) => item + '' + index}
                    renderItem={({ item }) => (
                      <Text style={templatestyles.dropdownItem}>{Template('New workout 1',item)}</Text>
                    )}
                    nestedScrollEnabled={true}
                  />
                {Template('doms push2', fillerworkoutsuggest)}
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
});

export default Workout;
