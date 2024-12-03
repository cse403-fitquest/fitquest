import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabLayout from '@/app/(tabs)/_layout';
import { useUserStore } from '@/store/user';
import { useItemStore } from '@/store/item';
import { User } from '@/types/user';
import { Item } from '@/types/item';
import { AnimatedSpriteID } from '@/constants/sprite';
import { ItemType } from '@/types/item';
import { SpriteID } from '@/constants/sprite';

// Mock user
const mockUser: User = {
  id: 'user123',
  profileInfo: {
    email: 'testuser@example.com',
    username: 'TestUser',
    age: 25,
    height: 6,
    weight: 150,
  },
  spriteID: AnimatedSpriteID.HERO_01,
  attributes: { power: 100, speed: 50, health: 200 },
  exp: 500,
  gold: 100,
  attributePoints: 0,
  currentQuest: { id: 'quest1', progress: { task1: 50 } },
  equippedItems: [],
  equipments: [],
  consumables: [],
  savedWorkouts: [],
  savedWorkoutTemplates: [],
  workoutHistory: [],
  privacySettings: {
    isLastWorkoutPublic: false,
    isCurrentQuestPublic: true,
  },
  createdAt: new Date(),
  isOnboardingCompleted: true,
};

// Mock items
const mockItems: Item[] = [
  {
    id: 'item1',
    type: ItemType.WEAPON,
    name: 'Sword',
    description: 'A sharp blade for cutting down foes.',
    power: 20,
    speed: 0,
    health: 0,
    spriteID: SpriteID.T1_SWORD,
    cost: 50,
    createdAt: new Date(),
  },
  {
    id: 'item2',
    type: ItemType.ARMOR,
    name: 'Shield',
    description: 'Provides strong defense against attacks.',
    power: 0,
    speed: -5,
    health: 50,
    spriteID: SpriteID.T1_SHIELD,
    cost: 30,
    createdAt: new Date(),
  },
];

// Mock stores
jest.mock('@/store/user', () => {
  const originalModule = jest.requireActual('@/store/user');
  return {
    ...originalModule,
    useUserStore: jest.fn(),
  };
});
jest.mock('@/store/item', () => ({
  useItemStore: jest.fn(),
}));

describe('Integration Test: Profile and Shop', () => {
  jest.clearAllMocks();

  // Mock user store
  (useUserStore as unknown as jest.Mock).mockReturnValue({
    user: mockUser,
    setUser: jest.fn((newUser) => Object.assign(mockUser, newUser)),
  });

  // Mock item store
  (useItemStore as unknown as jest.Mock).mockReturnValue({
    items: mockItems,
    setItems: jest.fn(),
  });

  it('navigates from Profile to Shop, buys an item, equips it, and updates stats', async () => {
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <TabLayout />
      </NavigationContainer>
    );

    // Ensure we are on the Profile tab
    expect(getByText('Power: 100')).toBeTruthy();
    expect(getByText('Health: 200')).toBeTruthy();
    expect(getByText('Gold: 100')).toBeTruthy();

    // Navigate to the Shop tab
    fireEvent.press(getByText('Shop'));
    await waitFor(() => expect(getByText('Shop')).toBeTruthy());

    // Verify the items are visible in the Shop
    expect(getByText('Sword')).toBeTruthy();
    expect(getByText('Shield')).toBeTruthy();

    // Buy the "Sword" item
    fireEvent.press(getByText('Sword'));
    fireEvent.press(getByText('BUY ITEM'));
    await waitFor(() =>
      expect(useUserStore().setUser).toHaveBeenCalledWith(
        expect.objectContaining({
          gold: 50, // 100 - 50 (cost of Sword)
        })
      )
    );

    // Navigate back to the Profile tab
    fireEvent.press(getByText('Profile'));
    await waitFor(() => expect(getByText('Profile')).toBeTruthy());

    // Equip the "Sword" item
    fireEvent.press(getByText('Sword'));
    fireEvent.press(getByText('EQUIP'));
    await waitFor(() =>
      expect(useUserStore().setUser).toHaveBeenCalledWith(
        expect.objectContaining({
          equippedItems: ['item1'], // Sword equipped
        })
      )
    );

    // Verify stats are updated
    expect(getByText('Power: 120')).toBeTruthy(); // Original 100 + Sword's 20
    expect(getByText('Health: 200')).toBeTruthy(); // No change
    expect(getByText('Gold: 50')).toBeTruthy(); // After purchasing Sword
  });
});
