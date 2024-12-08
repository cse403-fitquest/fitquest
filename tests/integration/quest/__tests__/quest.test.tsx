import {
  screen,
  render,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import Quest from '@/app/(tabs)/quest';
import { AnimatedSpriteID } from '@/constants/sprite';
import { getAvailableQuests } from '@/services/quest';
import { updateUserProfile } from '@/services/user';
import { getMonsterById } from '@/services/monster';
import { useUserStore } from '@/store/user';

// Enable fake timers
jest.useFakeTimers();

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock UUID
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

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

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: '',
}));

// Mock expo-router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock('expo-router', () => ({
  router: mockRouter,
  useRouter: () => mockRouter,
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
  activeWorkoutMinutes: 5,
  currentQuest: {
    id: 'quest_1',
    progress: {
      quest_1: 0,
    },
  },
  consumables: ['health_potion_small', 'health_potion_large'],
};

const mockQuests = {
  success: true,
  data: {
    quests: [
      {
        questId: 'quest_1',
        questName: 'Test Quest 1',
        spriteId: AnimatedSpriteID.SLIME_GREEN,
        milestones: [50, 100, 150],
        bossThreshold: 150,
        duration: 7,
        monsters: ['monster_1', 'monster_2'],
        boss: {
          spriteId: AnimatedSpriteID.SLIME_GREEN,
          health: 10,
          power: 20,
          speed: 15,
        },
      },
    ],
  },
};

const mockMonster = {
  id: 'monster_1',
  name: 'Test Monster',
  spriteId: AnimatedSpriteID.SLIME_GREEN,
  attributes: {
    health: 5,
    power: 10,
    speed: 5,
  },
};

const mockSetUser = jest.fn();

// Mock external dependencies
jest.mock('@/store/user', () => ({
  useUserStore: jest.fn(() => ({
    user: mockUser,
    setUser: mockSetUser,
  })),
}));

jest.mock('@/services/quest', () => ({
  getAvailableQuests: jest.fn(),
}));

jest.mock('@/services/user', () => ({
  updateUserProfile: jest.fn(),
}));

jest.mock('@/services/monster', () => ({
  getMonsterById: jest.fn(),
}));

describe('Quest Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAvailableQuests as jest.Mock).mockResolvedValue(mockQuests);
    (getMonsterById as jest.Mock).mockResolvedValue(mockMonster);
    (updateUserProfile as jest.Mock).mockResolvedValue({ success: true });
  });

  it('renders available quests correctly', async () => {
    render(<Quest />);

    await waitFor(() => {
      expect(screen.getByTestId('quest-item-0')).toBeTruthy();
    });
  });

  it('shows quest node details when clicking on future milestone', async () => {
    // Mock user with active quest
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      user: {
        ...mockUser,
        currentQuest: {
          id: 'quest_1',
          progress: { quest_1: 0 },
        },
      },
      setUser: mockSetUser,
    });

    render(<Quest />);

    await waitFor(() => {
      expect(screen.getByTestId('milestone-node-1')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('milestone-node-1'));

    await waitFor(() => {
      expect(screen.getByTestId('quest-node-modal')).toBeTruthy();
    });
  });
});
