import {
  screen,
  render,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react-native';
import Combat from '@/app/fight';
import React from 'react';
import { getMonsterById } from '@/services/monster';
import { updateUserProfile } from '@/services/user';
import { AnimatedSpriteID } from '@/constants/sprite';
// import { log } from 'console';

// Mock UUID with unique IDs
jest.mock('uuid', () => {
  let uuidCounter = 0;
  return {
    v4: jest.fn(() => `unique-id-${++uuidCounter}`),
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.Easing = {
    linear: jest.fn(),
    ease: jest.fn(),
    quad: jest.fn(),
    cubic: jest.fn(),
    bezier: jest.fn(),
  };
  return Reanimated;
});

// Mock AnimatedSprite component
jest.mock('@/components/AnimatedSprite', () => ({
  AnimatedSprite: () => null,
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
    replace: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({
    nextProgress: '2',
    questId: 'quest_1',
    isBoss: 'false',
    questMonsters: 'monster_1,monster_2',
  })),
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

// Mock Firebase Config
jest.mock('@/firebaseConfig', () => ({
  FIREBASE_DB: {},
  FIREBASE_AUTH: {},
}));

const mockUser = {
  id: 'user-1',
  profileInfo: {
    username: 'TestPlayer',
  },
  attributes: {
    power: 15,
    speed: 15,
    health: 6,
  },
  consumables: ['health_potion_small', 'health_potion_large'],
  currentQuest: {
    id: 'quest_1',
    progress: {},
  },
  gold: 100,
};

const mockMonster = {
  id: 'monster_1',
  name: 'Test Monster',
  attributes: {
    health: 5,
    power: 10,
    speed: 5,
  },
  spriteId: AnimatedSpriteID.SLIME_GREEN,
};

// Mocking useUserStore
jest.mock('@/store/user', () => ({
  useUserStore: () => ({
    user: mockUser,
    setUser: jest.fn(),
  }),
}));

// Mocking useItemStore
jest.mock('@/store/item', () => ({
  useItemStore: () => ({
    items: [],
  }),
}));

const mockSetUser = jest.fn();

// Mock external dependencies
jest.mock('@/store/user', () => ({
  useUserStore: jest.fn(() => ({
    user: mockUser,
    setUser: mockSetUser,
  })),
}));

jest.mock('@/services/monster', () => ({
  getMonsterById: jest.fn(),
}));

jest.mock('@/services/user', () => ({
  updateUserProfile: jest.fn(),
}));

// Mock StatusBar
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

// Mock timers
jest.useFakeTimers();

describe('Combat Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getMonsterById as jest.Mock).mockResolvedValue(mockMonster);
    (updateUserProfile as jest.Mock).mockResolvedValue({ success: true });

    // Reset timers
    jest.clearAllTimers();
  });

  it('handles normal attack correctly', async () => {
    render(<Combat />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('normal-attack-button')).toBeTruthy();
    });

    act(() => {
      jest.advanceTimersByTime(2000); // Advance 2 seconds (4 intervals)
    });

    // Press 'Attack' button
    act(() => {
      fireEvent.press(screen.getByTestId('normal-attack-button'));
    });

    // Advance timers to process attack delays (e.g., 500ms)
    act(() => {
      jest.advanceTimersByTime(1000); // Adjust based on actual delays
    });

    await waitFor(() => {
      expect(screen.findByText(/You dealt \d+ damage!/)).toBeTruthy();
    });
  });

  it('handles strong attack and cooldown', async () => {
    render(<Combat />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('strong-attack-button')).toBeTruthy();
    });

    act(() => {
      jest.advanceTimersByTime(2000); // Advance 2 seconds (4 intervals)
    });

    act(() => {
      fireEvent.press(screen.getByTestId('strong-attack-button'));
    });

    // Advance timers to process attack delays (e.g., 1000ms)
    act(() => {
      jest.advanceTimersByTime(1000); // Adjust based on actual delays
    });

    await waitFor(() => {
      expect(screen.findByText(/You dealt \d+ damage!/)).toBeTruthy();
      expect(screen.getByText(/\[CD: 2\]/)).toBeTruthy();
    });
  });

  it('handles potion usage correctly', async () => {
    render(<Combat />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('small-potion-button')).toBeTruthy();
    });

    act(() => {
      jest.advanceTimersByTime(2000); // Advance 2 seconds (4 intervals)
    });

    act(() => {
      fireEvent.press(screen.getByTestId('small-potion-button'));
    });

    expect(updateUserProfile).toHaveBeenCalledWith(
      mockUser.id,
      expect.objectContaining({
        consumables: expect.any(Array),
      }),
    );
  });
});
