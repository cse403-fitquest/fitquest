// __tests__/shop.test.ts

// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { screen, render, fireEvent } from '@testing-library/react-native';
import Shop from '@/app/(tabs)/shop'; // Update path if necessary
import { useUserStore } from '@/store/user';

import { Item, ItemType } from '@/types/item';
import { purchaseItem } from '@/services/item';
import {
  filterItemsByTypeAndSortByCost,
  getUserHealthPotionsCountFromItems,
} from '@/utils/item';
import { SpriteID } from '@/constants/sprite';
let mockUser = { id: 'user-1', name: 'Test User', gold: 60 };

const mockSetUser = jest.fn((updatedUser) => {
  mockUser = updatedUser;
});
// Mock UUID with unique IDs
jest.mock('uuid', () => {
  let uuidCounter = 0;
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
}));

// Mock Zustand stores
jest.mock('@/store/user', () => ({
  useUserStore: jest.fn(() => ({
    user: mockUser,
    setUser: mockSetUser,
  })),
}));

jest.mock('@/store/item', () => ({
  useItemStore: jest.fn(() => ({
    items: mockItems,
  })),
}));

jest.mock('@/services/item', () => ({
  purchaseItem: jest.fn(),
}));

// Mock getUserHealthPotionsCountFromItems
jest.mock('@/utils/item', () => ({
  getUserHealthPotionsCountFromItems: jest.fn(),
  filterItemsByTypeAndSortByCost: jest.fn(),
  itemTypeToString: jest.fn(),
  isItemConsumable: jest.fn(),
}));

const mockItems: Item[] = [
  {
    id: 'item-1',
    name: 'Sword',
    type: ItemType.WEAPON,
    cost: 50,
    power: 10,
    speed: 5,
    health: 0,
    spriteID: SpriteID.T1_SWORD,
    description: 'A sharp sword.',
    createdAt: new Date(),
  },
  {
    id: 'item-2',
    name: 'Shield',
    type: ItemType.ARMOR,
    cost: 75,
    power: 0,
    speed: -2,
    health: 20,
    spriteID: SpriteID.T1_SHIELD,
    description: 'A sturdy shield.',
    createdAt: new Date(),
  },
  {
    id: 'item-3',
    name: 'Small Potion',
    type: ItemType.POTION_SMALL,
    cost: 70,
    power: 0,
    speed: 0,
    health: 5,
    spriteID: SpriteID.HEALTH_POTION_SMALL,
    description: 'Restores a small amount of health.',
    createdAt: new Date(),
  },
];

describe('Shop Component', () => {
  const mockGetUserHealthPotionsCountFromItems =
    getUserHealthPotionsCountFromItems as jest.Mock;

  const mockFilterItemsByTypeAndSortByCost =
    filterItemsByTypeAndSortByCost as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetUserHealthPotionsCountFromItems.mockReturnValue([0, 0]);
    mockFilterItemsByTypeAndSortByCost.mockImplementation((items, type) =>
      items.filter((item: Item) => item.type === type),
    );
  });
  it('renders the Shop component with items', () => {
    render(<Shop />);

    // Check for Shop header and user gold
    expect(screen.getByText('Shop')).toBeTruthy();
    expect(screen.getByText(`60 Gold`)).toBeTruthy();

    // Check for item categories
    expect(screen.getByText('WEAPONS')).toBeTruthy();
    expect(screen.getByText('ARMORS')).toBeTruthy();
    expect(screen.getByText('ACCESSORIES')).toBeTruthy();
    expect(screen.getByText('POTIONS')).toBeTruthy();
  });

  it('opens and displays item details in a modal when an item is selected and goes back when canceled', async () => {
    render(<Shop />);

    screen.getByText('50 Gold');

    fireEvent.press(screen.getByText('50 Gold'));

    expect(screen.getByText('Purchase Sword')).toBeTruthy();
    expect(screen.getByText('CANCEL')).toBeTruthy();
    expect(screen.getByText('PURCHASE ITEM')).toBeTruthy();
    expect(screen.getByText('A sharp sword.')).toBeTruthy();
    expect(
      screen.getByText(`${mockItems[0].cost} Gold to purchase`),
    ).toBeTruthy();

    //should go back to main without decreasing money
    fireEvent.press(screen.getByText('CANCEL'));
    expect(screen.queryByText('Purchase Sword')).toBeNull();
    expect(screen.getByText('60 Gold')).toBeTruthy();
  });

  it('opens and displays item details then complete purchase when funds sufficient', async () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      user: mockUser,
      setUser: mockSetUser,
    });
    render(<Shop />);

    fireEvent.press(screen.getByText('50 Gold'));

    expect(screen.getByText('Purchase Sword')).toBeTruthy();
    expect(screen.getByText('CANCEL')).toBeTruthy();
    expect(screen.getByText('PURCHASE ITEM')).toBeTruthy();
    expect(screen.getByText('A sharp sword.')).toBeTruthy();
    expect(
      screen.getByText(`${mockItems[0].cost} Gold to purchase`),
    ).toBeTruthy();

    (purchaseItem as jest.Mock).mockResolvedValue({ success: true });
    // should fail to purchase when insufficient funds
    fireEvent.press(screen.getByText('PURCHASE ITEM'));
    expect(purchaseItem).toHaveBeenCalledWith(mockUser.id, mockItems[0].id);

    expect(mockSetUser).toHaveBeenCalledWith({
      ...mockUser,
      gold: 10,
    });
  });

  it('opens and displays item details then doesnt complete purchase when not enough funds', () => {
    render(<Shop />);
    fireEvent.press(screen.getByText('70 Gold'));

    expect(screen.getByText('Purchase Small Potion')).toBeTruthy();
    expect(screen.getByText('CANCEL')).toBeTruthy();
    expect(screen.getByText('PURCHASE ITEM')).toBeTruthy();
    expect(screen.getByText('Restores a small amount of health.')).toBeTruthy();
    expect(
      screen.getByText(`${mockItems[2].cost} Gold to purchase`),
    ).toBeTruthy();

    // should fail to purchase when insufficient funds
    fireEvent.press(screen.getByText('PURCHASE ITEM'));
    expect(screen.getByText('Purchase Small Potion')).toBeTruthy();
  });
});
