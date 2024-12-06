// Integration test for adding exercises to a workout

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import AddExercises from '@/app/(workout)/add-exercises';
// import { useWorkoutStore } from '@/store/workout';
// import { useUserStore } from '@/store/user';
import { ALL_EXERCISES_STUB } from '@/constants/workout';
// import { log, error } from 'console';
import { router } from 'expo-router';

// Mock UUID with unique IDs
jest.mock('uuid', () => {
  let uuidCounter = 0; // Define the counter inside the factory function
  return {
    v4: jest.fn(() => `unique-id-${++uuidCounter}`),
  };
});

// Mock asyncstorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: '',
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    navigate: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({
    isActiveWorkout: 'true',
  })),
}));

// Mock Zustand stores
jest.mock('@/store/user', () => ({
  useUserStore: () => ({
    user: { id: 'user-1', name: 'Test User' },
    setUser: jest.fn(),
  }),
}));

jest.mock('@/store/workout', () => ({
  useWorkoutStore: () => ({
    workout: {
      exercises: [],
    },
    setWorkout: jest.fn(),
  }),
}));

describe('AddExercises Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    render(<AddExercises />);
    expect(screen.getByText('Add exercises')).toBeTruthy();
  });

  it('should render exercises', () => {
    render(<AddExercises />);
    ALL_EXERCISES_STUB.forEach((exercise) => {
      expect(screen.getByText(exercise.name)).toBeTruthy();
    });
  });

  it('should first render exercises unselected', async () => {
    render(<AddExercises />);
    await waitFor(() => {
      ALL_EXERCISES_STUB.forEach((exercise) => {
        const exerciseTouchableOpacity = screen.getByTestId(
          `exercise-${exercise.name}`,
        );

        const exerciseView = exerciseTouchableOpacity.props.children[0];

        expect(exerciseView.props['data-selected']).toBeFalsy();
      });
    });
  });

  it('should allow selecting and deselecting an exercise', async () => {
    render(<AddExercises />);
    const exercise = ALL_EXERCISES_STUB[0]; // Example exercise
    const exerciseTouchableOpacity = screen.getByTestId(
      `exercise-${exercise.name}`,
    );

    const exerciseView = exerciseTouchableOpacity.props.children[0];

    // Initially not selected
    expect(exerciseView.props['data-selected']).toBeFalsy();

    // Select the exercise
    fireEvent.press(exerciseTouchableOpacity);

    await waitFor(() => {
      const exerciseTouchableOpacity2 = screen.getByTestId(
        `exercise-${exercise.name}`,
      );

      const exerciseView2 = exerciseTouchableOpacity2.props.children[0];

      expect(exerciseView2.props['data-selected']).toBeTruthy();
    });

    // Deselect the exercise
    fireEvent.press(exerciseTouchableOpacity);
    await waitFor(() => {
      expect(exerciseView.props['data-selected']).toBeFalsy();
    });
  });

  it('should display the checkmark button when exercises are selected', async () => {
    render(<AddExercises />);
    const exercise = ALL_EXERCISES_STUB[0];
    const testID = `exercise-${exercise.name}`;
    const exerciseTouchableOpacity = screen.getByTestId(testID);

    // Initially, checkmark should not be present
    expect(screen.queryByTestId('checkmark-button')).toBeNull();

    // Select an exercise
    fireEvent.press(exerciseTouchableOpacity);
    await waitFor(() => {
      expect(screen.getByTestId('checkmark-button')).toBeTruthy();
    });
  });

  it('should navigate back on checkmark press', async () => {
    // log('mockSetWorkout');

    render(<AddExercises />);
    const exercise = ALL_EXERCISES_STUB[0];
    const testID = `exercise-${exercise.name}`;
    const exerciseButton = screen.getByTestId(testID);

    // Select an exercise
    fireEvent.press(exerciseButton);

    // Press the checkmark
    const checkmarkButton = screen.getByTestId('checkmark-button');
    fireEvent.press(checkmarkButton);

    await waitFor(() => {
      expect(router.back).toHaveBeenCalled();
    });
  });
});
