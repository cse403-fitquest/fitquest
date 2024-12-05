// NewWorkout.test.tsx

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import NewWorkout from '@/app/(workout)/new-workout'; // Update the path accordingly
import { useWorkoutStore } from '@/store/workout';
import { useUserStore } from '@/store/user';
import { useGeneralStore } from '@/store/general';
import { finishAndSaveWorkout } from '@/services/workout';
import { router } from 'expo-router';
import { Alert, Dimensions } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
// import { log, error } from 'console';

// Mocking external modules and dependencies
jest.mock('@/store/workout');
jest.mock('@/store/user');
jest.mock('@/store/general');
jest.mock('@/services/workout');
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
}));
// Mock asyncstorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: '',
}));
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));
// Mock Firebase Auth methods
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
  signOut: jest.fn(),
}));

// Helper to mock useState for timer
jest.useFakeTimers();

// Mock Animated to prevent warnings
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated = {
    ...RN.Animated,
    spring: jest.fn(() => ({
      start: jest.fn(),
    })),
    Value: jest.fn().mockImplementation(() => ({
      setValue: jest.fn(),
    })),
  };
  return RN;
});

// Mock Dimensions.get to return a specific window width
Dimensions.get = jest.fn().mockReturnValue({ width: 400, height: 800 }); // Adjust as needed

describe('NewWorkout Component', () => {
  // Mock data
  const mockWorkout = {
    id: 'workout-1',
    name: 'Morning Routine',
    startedAt: new Date(Date.now() - 60000), // started 1 minute ago
    duration: 60,
    exercises: [
      {
        id: 'exercise-1',
        name: 'Push Ups',
        tags: ['REPS'],
        sets: [
          {
            id: '1',
            weight: 0,
            reps: 10,
            distance: 0,
            time: 0,
            completed: false,
          },
        ],
      },
    ],
  };

  const mockUser = {
    id: 'user-1',
    workoutHistory: [],
    exp: 1000,
    attributes: {
      strength: 5,
      endurance: 5,
      dexterity: 5,
      intelligence: 5,
    },
    attributePoints: 5,
  };

  const setWorkout = jest.fn();
  const clearWorkout = jest.fn();
  const setUser = jest.fn();
  const setLoading = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock useWorkoutStore
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workout: mockWorkout,
      setWorkout,
      clearWorkout,
    });

    // Mock useUserStore
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      user: mockUser,
      setUser,
    });

    // Mock useGeneralStore
    (useGeneralStore as unknown as jest.Mock).mockReturnValue({
      setLoading,
    });

    // Mock finishAndSaveWorkout service
    (finishAndSaveWorkout as jest.Mock).mockResolvedValue({
      success: true,
    });

    // Mock uuidv4
    // Setup a counter to generate unique IDs for each set
    let uuidCounter = 1; // First set is already present in mockWorkout
    (uuidv4 as jest.Mock).mockImplementation(() => `${++uuidCounter}`);
  });

  it('renders correctly', () => {
    const { getByText } = render(<NewWorkout />);

    expect(getByText('FINISH')).toBeTruthy();
    expect(getByText('ADD EXERCISE')).toBeTruthy();
    expect(getByText('CANCEL WORKOUT')).toBeTruthy();
    expect(getByText('Push Ups')).toBeTruthy();
    expect(getByText('SET')).toBeTruthy();
    expect(getByText('REPS')).toBeTruthy();
  });

  it('starts the timer correctly', () => {
    const { getByText } = render(<NewWorkout />);

    // Initial time should be 00:01:00 (assuming started 1 minute ago)
    expect(getByText('00:01:00')).toBeTruthy();

    // Advance timers by 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Update state
    expect(setWorkout).not.toHaveBeenCalled(); // setWorkout is not called by timer
    // To check if the timer updates, you might need to access the displayed text again
    // However, @testing-library/react-native does not update the component automatically
    // unless the state changes trigger a re-render, which is handled by the component itself.
  });

  it('allows adding a new set', () => {
    const { getByText } = render(<NewWorkout />);

    const addSetButton = getByText('ADD SET');
    fireEvent.press(addSetButton);

    expect(setWorkout).toHaveBeenCalledWith(expect.any(Function));

    // Verify that setWorkout was called to add a new set
    // Since setWorkout receives a function, we can invoke it with the current workout
    // and verify the new state
    const updater = setWorkout.mock.calls[0][0];
    const updatedWorkout = updater(mockWorkout);
    expect(updatedWorkout.exercises[0].sets).toHaveLength(2);
    expect(updatedWorkout.exercises[0].sets[1]).toEqual({
      id: '2',
      weight: 0,
      reps: 0,
      distance: 0,
      time: 0,
      completed: false,
    });
  });

  it('toggles set completion from uncomplete to complete', () => {
    const { getByTestId } = render(<NewWorkout />);

    const completeSetButton = getByTestId('complete-set-1');
    fireEvent.press(completeSetButton);

    expect(setWorkout).toHaveBeenCalledWith(expect.any(Function));

    // Verify that the set's 'completed' status was toggled
    const updater = setWorkout.mock.calls[0][0];
    const updatedWorkout = updater(mockWorkout);
    expect(updatedWorkout.exercises[0].sets[0].completed).toBe(true);
  });

  it('toggles set completion from complete to uncomplete', () => {
    // Modify mockWorkout to have completed sets
    const workoutCompleted = {
      ...mockWorkout,
      exercises: [
        {
          ...mockWorkout.exercises[0],
          sets: [{ ...mockWorkout.exercises[0].sets[0], completed: true }],
        },
      ],
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workout: workoutCompleted,
      setWorkout,
      clearWorkout,
    });

    const { getByTestId } = render(<NewWorkout />);

    const completeSetButton = getByTestId('complete-set-1');
    fireEvent.press(completeSetButton);

    expect(setWorkout).toHaveBeenCalledWith(expect.any(Function));

    // Verify that the set's 'completed' status was toggled
    const updater = setWorkout.mock.calls[0][0];
    const updatedWorkout = updater(mockWorkout);
    expect(updatedWorkout.exercises[0].sets[0].completed).toBe(false);
  });

  it('updates a set value', () => {
    const { getByTestId } = render(<NewWorkout />);

    const repsInput = getByTestId('set-input-1-REPS');

    fireEvent.changeText(repsInput, '12');
    fireEvent(repsInput, 'blur');

    expect(setWorkout).toHaveBeenCalledWith(expect.any(Function));

    const updater = setWorkout.mock.calls[0][0];
    const updatedWorkout = updater(mockWorkout);
    expect(updatedWorkout.exercises[0].sets[0].reps).toBe(12);
  });

  it('deletes a set', () => {
    const { getByTestId, queryByTestId } = render(<NewWorkout />);

    // Ensure the set is initially rendered
    const setItem = getByTestId('set-item-1');
    expect(setItem).toBeTruthy();

    // Get the delete button
    const deleteButton = getByTestId('set-item-delete-1');

    // Press the delete button
    fireEvent.press(deleteButton);

    // Verify that 'handleDeleteSet' was called, which should call 'setWorkout'
    expect(setWorkout).toHaveBeenCalledWith(expect.any(Function));

    // Extract the updater function and apply it to mockWorkout
    const updater = setWorkout.mock.calls[0][0];
    const updatedWorkout = updater(mockWorkout);

    // Verify that the set has been deleted
    expect(updatedWorkout.exercises).toHaveLength(0);

    // Verify that the set is no longer rendered
    expect(queryByTestId('set-item-set-1')).toBeNull();
  });

  it('handles finishing workout with completed sets', async () => {
    // Modify mockWorkout to have completed sets
    const workoutNoCompleted = {
      ...mockWorkout,
      exercises: [
        {
          ...mockWorkout.exercises[0],
          sets: [{ ...mockWorkout.exercises[0].sets[0], completed: true }],
        },
      ],
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workout: workoutNoCompleted,
      setWorkout,
      clearWorkout,
    });

    const { getByTestId, getByText } = render(<NewWorkout />);

    // Log the updated workout
    // log('mockWorkout', mockWorkout.exercises[0].sets[0]);

    // Finish the workout
    const finishButton = getByTestId('finish-workout-button');
    // log('finishButton', finishButton.props);

    fireEvent.press(finishButton);

    // Modal should appear
    await waitFor(() => {
      expect(getByTestId('finish-workout-confirm-modal')).toBeTruthy();
    });

    const confirmButton = getByText('FINISH WORKOUT');
    fireEvent.press(confirmButton);

    // Verify loading state
    expect(setLoading).toHaveBeenCalledWith(true);

    // Wait for async operations
    await act(async () => {
      await Promise.resolve();
    });

    expect(finishAndSaveWorkout).toHaveBeenCalledWith(
      mockUser.id,
      expect.any(Object),
    );
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(clearWorkout).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('workout');
  });

  it('handles finishing workout without completed sets', async () => {
    const { getByText, getByTestId } = render(<NewWorkout />);

    const finishButton = getByTestId('finish-workout-button');
    fireEvent.press(finishButton);

    // Modal should appear with "No Completed Sets"
    await waitFor(() => {
      expect(getByTestId('finish-cancel-workout-confirm-modal')).toBeTruthy();
    });

    const confirmCancelButton = getByText('FINISH WORKOUT');
    fireEvent.press(confirmCancelButton);

    expect(clearWorkout).toHaveBeenCalled();
    expect(router.back).toHaveBeenCalled();
  });

  it('handles canceling workout', async () => {
    const { getByTestId, getByText } = render(<NewWorkout />);

    const cancelButton = getByTestId('cancel-workout-button');
    fireEvent.press(cancelButton);

    // Modal should appear
    await waitFor(() => {
      expect(getByTestId('cancel-workout-confirm-modal')).toBeTruthy();
    });

    const confirmCancelButton = getByText('CANCEL THIS WORKOUT');
    fireEvent.press(confirmCancelButton);

    expect(clearWorkout).toHaveBeenCalled();
    expect(router.back).toHaveBeenCalled();
  });

  it('handles finishAndSaveWorkout failure', async () => {
    // Modify mockWorkout to have completed sets so finish modal appears
    const workoutNoCompleted = {
      ...mockWorkout,
      exercises: [
        {
          ...mockWorkout.exercises[0],
          sets: [{ ...mockWorkout.exercises[0].sets[0], completed: true }],
        },
      ],
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workout: workoutNoCompleted,
      setWorkout,
      clearWorkout,
    });

    // Mock failure response
    (finishAndSaveWorkout as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Server error',
    });

    const { getByText, getByTestId } = render(<NewWorkout />);

    const finishButton = getByTestId('finish-workout-button');
    fireEvent.press(finishButton);

    // Modal should appear
    await waitFor(() => {
      expect(getByTestId('finish-workout-confirm-modal')).toBeTruthy();
    });

    const confirmButton = getByText('FINISH WORKOUT');
    fireEvent.press(confirmButton);

    // Wait for async operations
    await act(async () => {
      await Promise.resolve();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error finishing and saving workout:',
      'Server error',
    );

    // Ensure user is reverted
    expect(setUser).toHaveBeenCalledWith(mockUser);
  });

  it('navigates to add-exercises screen', () => {
    const { getByTestId } = render(<NewWorkout />);

    const addExerciseButton = getByTestId('add-exercises-button');
    fireEvent.press(addExerciseButton);

    expect(router.push).toHaveBeenCalledWith('add-exercises');
  });
});
