// __tests__/shop.test.ts
import Profile from '@/app/(tabs)/profile';
// import { ItemType } from '@/types/item';
import { screen, render } from '@testing-library/react-native';

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
jest.mock('@expo/vector-icons', () => ({
  Ionicons: '',
}));

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
  };
  return RN;
});

jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native');
  return {
    ...ReactNative,
    Animated: {
      ...ReactNative.Animated,
      timing: jest.fn(() => ({
        start: jest.fn((callback) => callback && callback()),
        stopAnimation: jest.fn(),
      })),
    },
  };
});
jest.mock('react-native-reanimated', () => ({
  Easing: {
    steps: jest.fn(() => jest.fn()),
  },
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
// Repeat for all assets used or use a wildcard mock:
jest.mock('@/assets/sprites/animated/*', () => 'mockSpriteImage');
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
    MONSTER_01: 'MONSTER_01',
    BOSS_01: 'BOSS_01',
  },
  SpriteState: {
    IDLE: 'IDLE',
    MOVE: 'MOVE',
    ATTACK_1: 'ATTACK_1',
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
    updateUserProfile: jest.fn(() => Promise.resolve()),
    createUser: jest.fn(() => Promise.resolve()),
    getUser: jest.fn(() => Promise.resolve()),
    createUserFriends: jest.fn(() => Promise.resolve()),
    fillMissingUserFields: jest.fn(() => Promise.resolve()),
    userConverter: mockUser,
  };
});

////////////////////////////////// Components mocks //////////////////////////////////
jest.mock('@/components/FQModal', () => 'FQModal');
jest.mock('@/components/Sprite', () => 'Sprite');
jest.mock('@/components/AnimatedSprite', () => 'AnimatedSprite');
jest.mock('@/components/AnimatedSprite', () => {
  const React = require('react');
  const { View } = require('react-native');

  return jest.fn((props) => (
    <View testID="mock-animated-sprite">
      Mock AnimatedSprite - id: {props.id}, state: {props.state}, width:{' '}
      {props.width}
    </View>
  ));
});
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
    weight: 0,
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

const mockSetUser = jest.fn((updatedUser) => {
  mockUser = updatedUser;
});

describe('tests for profile screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('text rendering should work for main page', () => {
    render(<Profile />);

    expect(screen.getByText('Profile')).toBeTruthy();
  });
});
