// __tests__/shop.test.ts
import Profile from '@/app/(tabs)/profile';
import { ItemType } from '@/types/item';
import { screen, render } from '@testing-library/react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    navigate: jest.fn(),
    back: jest.fn(),
  },
}));

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

// Mock asyncstorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@/services/auth', () => ({
  signOut: jest.fn(),
}));

jest.mock('@/store/item', () => ({
  useItemStore: jest.fn(() => ({
    items: [],
    addItem: jest.fn(),
  })),
}));

jest.mock('@/store/social', () => ({
  useSocialStore: jest.fn(() => ({
    friends: [],
    addFriend: jest.fn(),
  })),
}));

jest.mock('@/utils/user', () => ({
  getUserExpThreshold: jest.fn(() => 100),
}));

jest.mock('@/store/item', () => ({
  useItemStore: jest.fn(() => ({
    items: [],
    addItem: jest.fn(),
  })),
}));

jest.mock('@/store/user', () => ({
  useUserStore: jest.fn(() => ({
    user: { id: 'user-1', name: 'Test User', gold: 60 },
    setUser: jest.fn(),
  })),
}));

jest.mock('@/services/user', () => ({
  updateUserProfile: jest.fn(),
}));

jest.mock('@/services/auth', () => ({
  signOut: jest.fn(),
}));

jest.mock('@/components/FQModal', () => 'FQModal');
jest.mock('@/components/Sprite', () => 'Sprite');
jest.mock('@/components/AnimatedSprite', () => 'AnimatedSprite');

// Mock UUID with unique IDs
jest.mock('uuid', () => {
  let uuidCounter = 0;
  return {
    v4: jest.fn(() => `unique-id-${++uuidCounter}`),
  };
});

jest.mock('@/store/item', () => ({
  useItemStore: jest.fn(() => ({
    items: mockItems,
  })),
}));
const mockItems = [
  {
    id: 'item-1',
    name: 'Sword',
    type: ItemType.WEAPON,
    cost: 50,
    power: 10,
    speed: 5,
    health: 0,
    spriteID: 'sprite-1',
    description: 'A sharp sword.',
  },
  {
    id: 'item-2',
    name: 'Shield',
    type: ItemType.ARMOR,
    cost: 75,
    power: 0,
    speed: -2,
    health: 20,
    spriteID: 'sprite-2',
    description: 'A sturdy shield.',
    testId: 'Shield',
  },
  {
    id: 'item-3',
    name: 'Small Potion',
    type: ItemType.POTION_SMALL,
    cost: 70,
    power: 0,
    speed: 0,
    health: 5,
    spriteID: 'sprite-3',
    description: 'Restores a small amount of health.',
  },
];

let mockUser = {
  id: 'user-1',
  name: 'Test User',
  gold: 60,
  privacySettings: {
    isCurrentQuestPublic: true,
  },
  profileInfo: {
    username: 'poopoo',
  },
};

const mockSetUser = jest.fn((updatedUser) => {
  mockUser = updatedUser;
});

// Mock Zustand stores
jest.mock('@/store/user', () => ({
  useUserStore: jest.fn(() => ({
    user: mockUser,
    setUser: mockSetUser,
  })),
}));

describe('tests for profile screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('text rendering should work for main page', () => {
    render(<Profile />);

    expect(screen.getByText('Profile')).toBeTruthy();
  });
});
