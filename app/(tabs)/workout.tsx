import { FlatList, Modal, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { secondsToMinutes } from '@/utils/workout';

const Workout = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(
    null,
  );
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const items = ['Bananas', 'Apples', 'Fruits'];

  // to swap between starting and stopping workouts
  const toggleWorkout = () => {
    if (isWorkoutActive) {
      stopWorkout();
    } else {
      startWorkout();
    }
    //setIsWorkoutActive(!isWorkoutActive);
    console.log(isWorkoutActive ? 'workout ended, final time: '+secondsToMinutes(secondsElapsed) : 'workout started');
  };

  // when workout is started
  // TODO: DELETE LINE BELOW WHEN USING THE FUNCTION
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      <Text className="text-4xl text-black font-bold text-left" style = {{marginTop: 10, marginBottom: 10}}> Workout</Text>
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
        <Text style={{marginLeft: 12}}>Time Elapsed: {secondsToMinutes(secondsElapsed)}</Text>

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
          <View style={templatestyles.box}>
            <Text style={templatestyles.title}>Saved Workout 1</Text>
            <TouchableOpacity style={templatestyles.viewButton} onPress={toggleDropdown}>
                <Text style={templatestyles.buttonText}>View</Text>
            </TouchableOpacity>

            {isDropdownVisible && (
                <Modal
                    transparent
                    animationType="fade"
                    visible={isDropdownVisible}
                    onRequestClose={() => setDropdownVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
                        <View style={templatestyles.modalOverlay} />
                    </TouchableWithoutFeedback>
                    <View style={templatestyles.dropdownContainer}>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <Text style={templatestyles.dropdownItem}>{item}</Text>
                            )}
                        />
                    </View>
                </Modal>
            )}
        </View>
        </View>

        {/* Suggested Templates Section */}
        <View className="w-full mt-5 px-4">
          <Text className="text-2xl text-black">Suggested Templates</Text>
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
      position: 'absolute',
      top: 100,
      right: 20,
      width: 100,
      backgroundColor: '#f9f9f9',
      borderRadius: 5,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
  },
  dropdownItem: {
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
  },
});

export default Workout;
