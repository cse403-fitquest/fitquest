import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { secondsToMinutes } from '@/utils/workout';

const Workout = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(
    null,
  );

  type exercise = {name: string, weight: Number, reps: Number, sets: Number} 

  const fillerex:exercise = {name: "Bench", weight: 135, reps: 20, sets: 4}
  const fillerworkout= [fillerex, fillerex, fillerex, fillerex]
  const fillerworkoutsuggest= [fillerex, fillerex, fillerex]

  const exerciseToString = (exercise: exercise) => {
    return exercise.name+"                     "+exercise.weight+"               "+exercise.reps+"               "+exercise.sets+"  ";
  }
  const exercisesToString = (exercises: exercise[]) => {
    let str = []
    for(const exercise of exercises){
      str.push(exerciseToString(exercise))
    }
    return str;
  }
  //constructor for a Template 
  const Template = (title: string, exercises: exercise[]) => {
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
          <TouchableOpacity style={templatestyles.circle} onPress={toggleSelection}>
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
            <Text style={templatestyles.dropdownItem}> Name              |    Weight     |   Reps     |  Sets  </Text>
            <FlatList
                data={ exercisesToString(exercises) }
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <Text style={templatestyles.dropdownItem}>{item}</Text>
                )}
            />
          </View>
        )}
      </View>

    )

  }
  
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

  return (
    <SafeAreaView className="flex-1 items-left justify-left h-full bg-offWhite">
      <Text
        className="text-4xl text-black font-bold text-left"
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        {' '}
        Workout
      </Text>
      <SafeAreaView className="flex-1 items-left justify-r h-full">
        {/* Start/Stop Workout Button */}
        <TouchableOpacity
          onPress={toggleWorkout}
          style={{
            backgroundColor: isWorkoutActive ? 'red' : 'purple',
            width: 145,
            padding: 15,
            marginLeft: 5,
            marginTop: 0,
            borderRadius: 40,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>
            {isWorkoutActive ? 'Stop Workout' : 'Start Workout'}
          </Text>
        </TouchableOpacity>

        {/* Placeholder because linter does not accept unused values (secondsElapsed was previously unused) */}
        <Text style={{ marginLeft: 12 }}>
          Time Elapsed: {secondsToMinutes(secondsElapsed)}
        </Text>

        {/* Create Template Button */}
        <TouchableOpacity
          style={{
            backgroundColor: 'purple',
            width: 165,
            padding: 15,
            marginLeft: 5,
            marginTop: 15,
            borderRadius: 40,
          }}
          onPress={() => console.log('create template pressed')}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>Create Template</Text>
        </TouchableOpacity>

        {/* Saved Templates Section */}
        <View className="w-full mt-5 px-4">
          <Text className="text-2xl text-black">Saved Templates</Text>
            {Template("doms push", fillerworkout)}
        </View>

        {/* Suggested Templates Section */}
        <View className="w-full mt-5 px-4">
          <Text className="text-2xl text-black">Suggested Templates</Text>
          {Template("doms push2", fillerworkoutsuggest)}
        </View>
      </SafeAreaView>
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
});

export default Workout;
