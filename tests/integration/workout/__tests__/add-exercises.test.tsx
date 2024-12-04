// Integration test for adding exercises to a workout

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { userEvent } from '@testing-library/react-native';
import { v4 as uuidv4 } from 'uuid';
import AddExercises from '@/app/(workout)/add-exercises';
import { useWorkoutStore } from '@/store/workout';
import { useUserStore } from '@/store/user';
import { ALL_EXERCISES_STUB } from '@/constants/workout';
import { log, error } from 'console';

let uuidCounter = 0;

jest.mock('uuid', () => ({
  v4: jest.fn(() => `unique-id-${++uuidCounter}`),
}));

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
}));

// Mock UUID
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'unique-id'),
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
    workout: { exercises: [] },
    setWorkout: jest.fn(),
  }),
}));

describe('AddExercises', () => {
  //   const setWorkout = jest.fn();
  //   const setUser = jest.fn();
  //   const user = { id: '1' };

  beforeEach(() => {
    jest.clearAllMocks();
    // (useWorkoutStore as unknown as jest.Mock).mockReturnValue({ setWorkout });
    // (useUserStore as unknown as jest.Mock).mockReturnValue({ setUser, user });
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

  it('should first render exercises unselected', () => {
    render(<AddExercises />);
    ALL_EXERCISES_STUB.forEach((exercise) => {
      expect(
        screen.getByTestId(`exercise-${exercise.name}`).props['data-selected'],
      ).toBeFalsy();
    });
  });

  it('should allow selecting and deselecting an exercise', async () => {
    // render(<AddExercises />);
    // const exercise = ALL_EXERCISES_STUB[0]; // Example exercise
    // const exerciseButton = screen.getByTestId(`exercise-${exercise.name}`);
    // log('exerciseButton', exerciseButton.props);
    // console.log('exerciseButton', exerciseButton.props);
    // // Initially not selected
    // expect(exerciseButton.props['data-selected']).toBeFalsy();
    // // Select the exercise
    // fireEvent.press(exerciseButton);
    // await waitFor(
    //   () => {
    //     expect(exerciseButton.props['data-selected']).toBeTruthy();
    //   },
    //   { timeout: 1000 },
    // );
    // // Deselect the exercise
    // fireEvent.press(exerciseButton);
    // await waitFor(
    //   () => {
    //     expect(exerciseButton.props['data-selected']).toBeFalsy();
    //   },
    //   { timeout: 1000 },
    // );
  });
  it('should unselect exercise', () => {});
});
