import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Modal,
  TextInput,
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

  type Template = { title: string; exercises: Exercise[] };

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

  // const fillerworkout = [fillerex, fillerex, fillerex, fillerex];
  const fillerworkoutsuggest = [fillerex, fillerex, fillerex];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<Template[]>([]);

  const [title, setTitle] = useState('New Workout');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

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
  const updateExercise = (index: number, key: string, value: number) => {
    // Update the specific property (weight, reps, sets) of the exercise
    const updatedExercises: Exercise[] = [...selectedExercises];
    if (key === 'weight') {
      updatedExercises[index].weight = value;
    }
    if (key === 'reps') {
      updatedExercises[index].reps = value;
    }
    if (key === 'sets') {
      updatedExercises[index].sets = value;
    }
    setSelectedExercises(updatedExercises);
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
      '                ' +
      exercise.weight +
      '                ' +
      exercise.reps +
      '                ' +
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
    setSelectedTemplate((prevSelected) => (prevSelected === index ? null : index));
  };

  const saveWorkout = (workout: Template) => {
    setSavedTemplates([...savedTemplates, workout]);
    setSelectedExercises([]);
    setModalVisible(false);
    console.log('Successfully added ' + workout + 'to saved templates');
  };

  // takes name of workout and removes it from the saved templates
  const removeWorkout = (title: string) => {
    console.log('Removed ' + title + ' from saved templates');
    setSavedTemplates(
      savedTemplates.filter((item) => item.title !== title),
    );
  }

  //constructor for a Template
  const Template = ({
    title,
    exercises,
    isSelected,
    toggleSelection,
  }: {
    title: string;
    exercises: Exercise[];
    isSelected: boolean;
    toggleSelection: () => void;
  }) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);

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
            {/* Editable Title */}
            <View style={templatestyles.titleContainer}>
              {isEditingTitle ? (
                <TextInput
                  style={templatestyles.titleInput}
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  onBlur={() => setIsEditingTitle(false)} // Exit edit mode on blur
                  autoFocus
                />
              ) : (
                <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                  <Text style={templatestyles.titleText}>{title}</Text>
                </TouchableOpacity>
              )}
            </View>

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
              <Text style={templatestyles.templateCreatorTableHeader}>
                {' '}
                | Name | Weight | Reps | Sets |
              </Text>

              <FlatList
                data={selectedExercises}
                keyExtractor={(item) => item.name}
                renderItem={({ item, index }) => (
                  <View style={templatestyles.exerciseItem}>
                    <TouchableOpacity
                      style={templatestyles.removeButton}
                      onPress={() => removeExercise(item.name)}
                    >
                      <Text style={templatestyles.addButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text> {item.name}</Text>
                    {/* Weight input */}
                    <TextInput
                      style={templatestyles.input}
                      placeholder="Weight"
                      value={item.weight.toString()}
                      keyboardType="numeric"
                      onChangeText={(value) =>
                        updateExercise(index, 'weight', +value)
                      }
                    />

                    {/* Reps input */}
                    <TextInput
                      style={templatestyles.input}
                      placeholder="Reps"
                      value={item.reps.toString()}
                      keyboardType="numeric"
                      onChangeText={(value) =>
                        updateExercise(index, 'reps', +value)
                      }
                    />

                    {/* Sets input */}
                    <TextInput
                      style={templatestyles.input}
                      placeholder="Sets"
                      value={item.sets.toString()}
                      keyboardType="numeric"
                      onChangeText={(value) =>
                        updateExercise(index, 'sets', +value)
                      }
                    />
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
                onPress={() =>
                  saveWorkout({ title: title, exercises: selectedExercises })
                } // Close modal
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
    <SafeAreaView className="flex-1 items-left justify-left h-full bg-offWhite ">
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <View className="py-8 px-6">
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

              {/* Saved Templates Section */}
              <View className="w-full mt-5 flex-row justify-between items-center">
                <Text className="text-xl text-grayDark font-bold mb-2">
                  MY TEMPLATES
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  {CreateTemplateScreen()}
                  <Text style={templatestyles.addtemplatebutton} className="text-xl text-blue-1000">+</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                  data={savedTemplates}
                  keyExtractor={(_, index) => `template-${index}`}
                  renderItem={({ item, index }) => (
                    <Template title={item.title} 
                              exercises={item.exercises} 
                              isSelected={selectedTemplate === index}
                              toggleSelection={() => toggleSelection(index)}

                    />
                  )}
                  nestedScrollEnabled={true}
                />
                

              {/* Suggested Templates Section */}
              <View className="w-full mt-5">
                <Text className="text-xl text-grayDark font-bold mb-2">
                  SUGGESTED TEMPLATES
                </Text>
                <Template title="Push Day" exercises={fillerworkoutsuggest} isSelected={false} toggleSelection={() => toggleSelection(13)} />
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
    marginRight: 65
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
});

export default Workout;
