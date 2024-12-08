// __tests__/shop.test.ts

////////////////////////////////// FIREBASE MOCKS //////////////////////////////////
jest.mock('firebase/firestore');
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
  signOut: jest.fn(),
  currentUser: mockUser,
}));

////////////////////////////////// EXPO MOCKS //////////////////////////////////
// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    navigate: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock Ionicons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    Ionicons: jest.fn(({ name }) => {
      if (name === 'settings-outline') {
        return <Text testID="settings-outline">settings icon</Text>;
      }
      return <Text testID={'mock-ionicon-' + name}>{name}</Text>;
    }),
  };
});

////////////////////////////////// STORE MOCKS //////////////////////////////////
jest.mock('@/store/social', () => ({
  useSocialStore: jest.fn(() => ({
    friends: [],
    addFriend: jest.fn(),
  })),
}));
jest.mock('@/store/item', () => ({
  useItemStore: jest.fn(() => ({
    items: [],
    addItem: jest.fn(),
  })),
}));
// Mock Zustand stores
jest.mock('@/store/user', () => ({
  useUserStore: jest.fn(() => ({
    user: mockUser,
    setUser: mockSetUser,
  })),
}));
const mockSetUser = jest.fn((updatedUser) => {
  mockUser = updatedUser;
});

////////////////////////////////// reactnative mocks //////////////////////////////////
// Mock asyncstorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
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
    timing: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
      stopAnimation: jest.fn(),
    })),
  };
  return RN;
});

jest.mock('react-native-reanimated', () => ({
  Easing: {
    steps: jest.fn(() => jest.fn()),
  },
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));
////////////////////////////////// ASSETS mocks  //////////////////////////////////

jest.mock(
  '@/assets/sprites/animated/heroes/hero_01.png',
  () => 'mockHeroImage',
);
jest.mock(
  '@/assets/sprites/animated/heroes/hero_02.png',
  () => 'mockHeroImage',
);
jest.mock(
  '@/assets/sprites/animated/heroes/hero_20.png',
  () => 'mockHeroImage',
);
// Repeat for all assets used or use a wildcard mock:
// jest.mock('@/assets/sprites/animated/heroes/*', () => 'mockSpriteImage');
////////////////////////////////// UTILS mocks  //////////////////////////////////

jest.mock('@/utils/user', () => ({
  getUserExpThreshold: jest.fn(() => 100),
}));
jest.mock('@/utils/sprite', () => ({
  isHeroSprite: jest.fn((id) => id.startsWith('HERO')),
  isMonsterSprite: jest.fn((id) => id.startsWith('MONSTER')),
  isBossSprite: jest.fn((id) => id.startsWith('BOSS')),
}));

////////////////////////////////// CONSTANTS mocks  //////////////////////////////////

jest.mock('@/constants/sprite', () => ({
  AnimatedSpriteID: {
    HERO_01: 'HERO_01',
    HERO_20: 'HERO_20',
    MONSTER_01: 'MONSTER_01',
    BOSS_01: 'BOSS_01',
  },
  SpriteState: {
    IDLE: 'IDLE',
    MOVE: 'MOVE',
    ATTACK_1: 'ATTACK_1',
  },
}));
jest.mock('@/constants/item', () => ({
  SpriteID: {
    T1_DAGGER: 'T1_DAGGER',
  },
}));
////////////////////////////////// SERVICES mocks //////////////////////////////////

jest.mock('@/services/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
  signOut: jest.fn(),
  signUp: jest.fn(),
  isLoggedIn: jest.fn(),
  deleteAccount: jest.fn(),
}));

jest.mock('@/services/user', () => {
  return {
    getUserFromDatabase: jest.fn(() => Promise.resolve(mockUser)),
    updateAllUsersInDB: jest.fn(() => Promise.resolve(mockUser)),
    updateUserProfile: jest.fn(),
    createUser: jest.fn(() => Promise.resolve()),
    getUser: jest.fn(() => Promise.resolve()),
    createUserFriends: jest.fn(() => Promise.resolve()),
    fillMissingUserFields: jest.fn(() => Promise.resolve()),
    userConverter: mockUser,
  };
});
// const mockUpdateUserProfile = jest.fn(() => Promise.resolve(mockUser));

////////////////////////////////// Components mocks //////////////////////////////////
// jest.mock('@/components/FQModal', () => 'FQModal');
jest.mock('@/components/Sprite', () => 'Sprite');
jest.mock('@/components/AnimatedSprite', () => ({
  AnimatedSprite: { id: 'HERO_01', state: 'IDLE' },
}));

jest.mock('@/components/AnimatedSprite', () => ({
  AnimatedSprite: jest.fn(),
}));

// Mock UUID with unique IDs
jest.mock('uuid', () => {
  let uuidCounter = 0;
  return {
    v4: jest.fn(() => `unique-id-${++uuidCounter}`),
  };
});

let mockUser = {
  attributes: { power: 5, speed: 5, health: 10 },
  consumables: [],
  equipments: [],
  equippedItems: [],
  exp: 0,
  gold: 100,
  id: '1aA0I6IwN5Ts8BBr68CH19wzlQz1',
  isOnboardingCompleted: true,
  profileInfo: {
    age: 20,
    email: 'lex@gmail.com',
    height: 5.9,
    username: 'lexbrawlstars',
    weight: 170,
  },
  privacySettings: {
    isCurrentQuestPublic: true,
    isLastWorkoutPublic: true,
  },
  savedWorkoutTemplates: [],
  savedWorkouts: [],
  spriteID: 'hero_01',
  workoutHistory: [],
};

import Profile from '@/app/(tabs)/profile';
import { updateUserProfile } from '@/services/user';
// import { useUserStore } from '@/store/user';
// import { ItemType } from '@/types/item';
import {
  render,
  waitFor,
  screen,
  fireEvent,
} from '@testing-library/react-native';
import { Alert } from 'react-native';

// import { AnimatedSprite } from '@/components/AnimatedSprite.tsx'
describe('tests for profile screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests profile default screen for text content
  it('text rendering should work for main page', async () => {
    await waitFor(() => {
      render(<Profile />);
      expect(true).toBe(true);
      expect(screen.getByText('ATTRIBUTES')).toBeTruthy();
      expect(screen.getByText('ITEMS')).toBeTruthy();
      expect(screen.getByText('WORKOUTS PER WEEK')).toBeTruthy();
      expect(screen.getByText('Gold: 100')).toBeTruthy();
      expect(screen.getByText('Health: 10')).toBeTruthy();
      expect(screen.getByText('Speed: 5')).toBeTruthy();
      expect(screen.getByText('Power: 5')).toBeTruthy();
      //users should start with no items
      expect(
        screen.getByText('You have no items. Visit the shop!'),
      ).toBeTruthy();
      expect(screen.getByText('100 EXP TILL LEVEL UP')).toBeTruthy();
      expect(screen.getByText('Welcome,')).toBeTruthy();
      expect(screen.getByText('lexbrawlstars')).toBeTruthy();
    });
  });

  // Tests settings popup within profile
  it('opening settings tab and filling fields before confirming ', async () => {
    await waitFor(() => {
      render(<Profile />);
      expect(true).toBe(true);

      // Settings Modal is open
      fireEvent.press(screen.getByTestId('settings-outline'));
      //these should be visible now
      expect(screen.getByText('Weight (lbs)')).toBeTruthy();
      expect(screen.getByText('Height (ft)')).toBeTruthy();
      expect(screen.getByText('Username')).toBeTruthy();
      expect(screen.getByText('Profile Settings')).toBeTruthy();
      expect(screen.getByText('SIGN OUT')).toBeTruthy();
      expect(screen.getByText('Share Current Quest')).toBeTruthy();
      expect(screen.getByTestId('mock-ionicon-close')).toBeTruthy();
      expect(screen.getByText('CONFIRM')).toBeTruthy();

      // should error if the user confirms without making changes
      fireEvent.press(screen.getByText('CONFIRM'));
      expect(Alert.alert).toHaveBeenCalledWith(
        'No changes detected',
        'Please make changes before confirming.',
      );
    });
  });
  it('successfully change username', async () => {
    await waitFor(() => {
      (updateUserProfile as unknown as jest.Mock).mockReturnValue({
        user: mockUser,
        updates: {
          ...mockUser,
          profileInfo: {
            ...mockUser.profileInfo,
            username: 'lombardstreet',
          },
        },
      });

      render(<Profile />);
      expect(true).toBe(true);
      fireEvent.press(screen.getByTestId('settings-outline'));
      fireEvent.changeText(
        screen.getByPlaceholderText('Enter username'),
        'lombardstreet',
      );
      expect(screen.getByDisplayValue('lombardstreet')).toBeTruthy();

      fireEvent.press(screen.getByText('CONFIRM'));
      expect(updateUserProfile).toHaveBeenCalledWith(
        '1aA0I6IwN5Ts8BBr68CH19wzlQz1',
        {
          ...mockUser,
          profileInfo: {
            ...mockUser.profileInfo,
            username: 'lombardstreet',
          },
        },
      );
    });
  });
});
