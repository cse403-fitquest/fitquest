// __tests__/shop.test.ts

// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { screen, render, fireEvent } from '@testing-library/react-native';
import Shop from '@/app/(tabs)/shop'; // Update path if necessary
import React from 'react';
// import { useUserStore } from '@/store/user';
// import { useItemStore } from '@/store/item';
// import { BASE_ITEM } from '@/constants/item';
import { ItemType } from '@/types/item';
import { purchaseItem } from '@/services/item';
// import { useUserStore } from '@/store/user';
// import { purchaseItem } from '@/services/item';
// import { BASE_USER } from '@/constants/user';
// Mock stores and services
// jest.mock('@/store/user', () => ({
//   useUserStore: jest.fn(),
// }));
// jest.mock('@/store/item', () => ({
//   useItemStore: jest.fn(),
// }));
jest.mock('@/services/item', () => ({
  purchaseItem: jest.fn(),
}));
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
}));

// Mock Zustand stores
jest.mock('@/store/user', () => ({
  useUserStore: () => ({
    user: { id: 'user-1', name: 'Test User', gold: 60 },
    setUser: jest.fn(),
  }),
}));

jest.mock('@/store/item', () => ({
  useItemStore: jest.fn(() => ({
    items: mockItems, // Provide the mock items here
  })),
}));

jest.mock('@/services/item', () => ({
  purchaseItem: jest.fn(), //.mockResolvedValue({ success: true }), // Mock success response
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

// Set up mocks
// beforeEach(() => {
//   (useUserStore as jest.Mock).mockReturnValue({
//     user: mockUser,
//     setUser: jest.fn(),
//   });

//   (useItemStore as jest.Mock).mockReturnValue({
//     items: mockItems,
//   });

//   (purchaseItem as jest.Mock).mockResolvedValue({ success: true });
// });

describe('Shop Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the Shop component with items', () => {
    render(React.createElement<typeof Shop>(Shop));
    expect(true).toBe(true);
    // Check for Shop header and user gold
    expect(screen.getByText('Shop')).toBeTruthy();
    expect(screen.getByText(`60 Gold`)).toBeTruthy();

    // Check for item categories
    expect(screen.getByText('WEAPONS')).toBeTruthy();
    expect(screen.getByText('ARMORS')).toBeTruthy();
    expect(screen.getByText('ACCESSORIES')).toBeTruthy();
    expect(screen.getByText('POTIONS')).toBeTruthy();
  });

  it('opens and displays item details in a modal when an item is selected and goes back when canceled', () => {
    render(React.createElement<typeof Shop>(Shop));
    // const { getByText } = render(React.createElement<typeof Shop>(Shop));
    fireEvent.press(screen.getByText('50 Gold'));
    expect(true).toBe(true);
    // // Check for modal content
    expect(screen.getByText('Equip Sword')).toBeTruthy();
    expect(screen.getByText('CANCEL')).toBeTruthy();
    expect(screen.getByText('BUY ITEM')).toBeTruthy();
    expect(screen.getByText('A sharp sword.')).toBeTruthy();
    expect(
      screen.getByText(`${mockItems[0].cost} Gold to purchase`),
    ).toBeTruthy();

    //should go back to main without decreasing money
    fireEvent.press(screen.getByText('CANCEL'));
    expect(screen.queryByText('Equip Sword')).toBeNull();
    expect(screen.getByText('60 Gold')).toBeTruthy();
  });

  it('opens and displays item details then complete purchase when funds sufficient', async () => {
    //TODO: implment user to finish correct buy
    const mockSetUser = jest.fn();
    (useUserStore as jest.Mock).mockReturnValue({
      user: { id: 'user-1', name: 'Test User', gold: 50 },
      setUser: mockSetUser,
    });
    render(React.createElement<typeof Shop>(Shop));
    // const { getByText } = render(React.createElement<typeof Shop>(Shop));
    fireEvent.press(screen.getByText('50 Gold'));
    expect(true).toBe(true);
    // // Check for modal content
    expect(screen.getByText('Equip Sword')).toBeTruthy();
    expect(screen.getByText('CANCEL')).toBeTruthy();
    expect(screen.getByText('BUY ITEM')).toBeTruthy();
    expect(screen.getByText('A sharp sword.')).toBeTruthy();
    expect(
      screen.getByText(`${mockItems[0].cost} Gold to purchase`),
    ).toBeTruthy();

    (purchaseItem as jest.Mock).mockResolvedValue({ success: false });
    // should fail to purchase when insufficient funds
    fireEvent.press(screen.getByText('BUY ITEM'));
    expect(screen.getByText('10 Gold')).toBeTruthy();
    //expect(screen.queryByText('10 Gold')).toBeTruthy();
    //expect(screen.getByText('70 Gold')).toBeTruthy();
  });

  it('opens and displays item details then doesnt complete purchase when not enough funds', () => {
    render(React.createElement<typeof Shop>(Shop));
    // const { getByText } = render(React.createElement<typeof Shop>(Shop));
    fireEvent.press(screen.getByText('70 Gold'));
    expect(true).toBe(true);
    // // Check for modal content
    expect(screen.getByText('Equip Small Potion')).toBeTruthy();
    expect(screen.getByText('CANCEL')).toBeTruthy();
    expect(screen.getByText('BUY ITEM')).toBeTruthy();
    expect(screen.getByText('Restores a small amount of health.')).toBeTruthy();
    expect(
      screen.getByText(`${mockItems[2].cost} Gold to purchase`),
    ).toBeTruthy();

    // should fail to purchase when insufficient funds
    fireEvent.press(screen.getByText('BUY ITEM'));
    expect(screen.getByText('Equip Small Potion')).toBeTruthy();
  });

  // it('shows an alert if the user does not have enough gold to purchase an item', async () => {
  //   const { getByText } = render(Shop());
  //   fireEvent.press(getByText('Shield'));

  //   const buyButton = getByText('BUY ITEM');
  //   fireEvent.press(buyButton);

  //   await waitFor(() => {
  //     expect(getByText('Not enough gold')).toBeTruthy();
  //   });
  // });

  // it('purchases a consumable item and updates the user store', async () => {
  //   const setUserMock = jest.fn();
  //   (useUserStore as unknown as jest.Mock).mockReturnValue({
  //     user: mockUser,
  //     setUser: setUserMock,
  //   });

  //   const { getByText } = render(Shop());
  //   fireEvent.press(getByText('Small Potion'));

  //   const buyButton = getByText('BUY ITEM');
  //   fireEvent.press(buyButton);

  //   await waitFor(() => {
  //     expect(purchaseItem).toHaveBeenCalledWith(mockUser.id, mockItems[2].id);
  //     expect(setUserMock).toHaveBeenCalledWith({
  //       ...mockUser,
  //       gold: mockUser.gold - mockItems[2].cost,
  //       consumables: [...mockUser.consumables, mockItems[2].id],
  //     });
  //   });
  // });

  // it('purchases an equipment item and updates the user store', async () => {
  //   const setUserMock = jest.fn();
  //   (useUserStore as unknown as jest.Mock).mockReturnValue({
  //     user: mockUser,
  //     setUser: setUserMock,
  //   });

  //   const { getByText } = render(Shop());
  //   fireEvent.press(getByText('Sword'));

  //   const buyButton = getByText('BUY ITEM');
  //   fireEvent.press(buyButton);

  //   await waitFor(() => {
  //     expect(purchaseItem).toHaveBeenCalledWith(mockUser.id, mockItems[0].id);
  //     expect(setUserMock).toHaveBeenCalledWith({
  //       ...mockUser,
  //       gold: mockUser.gold - mockItems[0].cost,
  //       equipments: [...mockUser.equipments, mockItems[0].id],
  //     });
  //   });
  // });

  // it('does not purchase an item if the API request fails', async () => {
  //   (purchaseItem as jest.Mock).mockResolvedValueOnce({ success: false });

  //   const setUserMock = jest.fn();
  //   (useUserStore as unknown as jest.Mock).mockReturnValue({
  //     user: mockUser,
  //     setUser: setUserMock,
  //   });

  //   const { getByText } = render(Shop());
  //   fireEvent.press(getByText('Sword'));

  //   const buyButton = getByText('BUY ITEM');
  //   fireEvent.press(buyButton);

  //   await waitFor(() => {
  //     expect(setUserMock).toHaveBeenCalledTimes(0); // Ensure no state change
  //     expect(getByText('Error purchasing equipment')).toBeTruthy();
  //   });
  // });
});
