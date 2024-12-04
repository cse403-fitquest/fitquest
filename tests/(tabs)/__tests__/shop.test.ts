// __tests__/shop.test.ts

// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { render } from '@testing-library/react-native';
import Shop from '@/app/(tabs)/shop'; // Update path if necessary
import React from 'react';
// import { useUserStore } from '@/store/user';
// import { useItemStore } from '@/store/item';
// import { BASE_ITEM } from '@/constants/item';
// import { ItemType } from '@/types/item';
// import { purchaseItem } from '@/services/item';
// import { BASE_USER } from '@/constants/user';
// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: '',
}));
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
// jest.mock('react', () => ({
//   useState: jest.fn(),
// }));

// Test data
// const mockUser = {
//   id: 'user-1',
//   gold: 0,
//   equipments: [],
//   consumables: [],
// };

// const mockItems = [
//   {
//     id: 'item-1',
//     name: 'Sword',
//     type: ItemType.WEAPON,
//     cost: 50,
//     power: 10,
//     speed: 5,
//     health: 0,
//     spriteID: 'sprite-1',
//     description: 'A sharp sword.',
//   },
//   {
//     id: 'item-2',
//     name: 'Shield',
//     type: ItemType.ARMOR,
//     cost: 75,
//     power: 0,
//     speed: -2,
//     health: 20,
//     spriteID: 'sprite-2',
//     description: 'A sturdy shield.',
//   },
//   {
//     id: 'item-3',
//     name: 'Small Potion',
//     type: ItemType.POTION_SMALL,
//     cost: 10,
//     power: 0,
//     speed: 0,
//     health: 5,
//     spriteID: 'sprite-3',
//     description: 'Restores a small amount of health.',
//   },
// ];

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
    const { getByText } = render(React.createElement<typeof Shop>(Shop));
    expect(true).toBe(true);
    // Check for Shop header and user gold
    expect(getByText('Shop')).toBeTruthy();
    expect(getByText(`0 Gold`)).toBeTruthy();

    // Check for item categories
    expect(getByText('WEAPONS')).toBeTruthy();
    expect(getByText('ARMORS')).toBeTruthy();
    expect(getByText('ACCESSORIES')).toBeTruthy();
    expect(getByText('POTIONS')).toBeTruthy();

    // // Check for items
    // expect(getByText('Sword')).toBeTruthy();
    // expect(getByText('Shield')).toBeTruthy();
    // expect(getByText('Small Potion')).toBeTruthy();
  });

  // it('opens and displays item details in a modal when an item is selected', () => {
  //   const { getByText } = render(Shop());
  //   fireEvent.press(getByText('Sword'));

  //   // Check for modal content
  //   expect(getByText('Equip Sword')).toBeTruthy();
  //   expect(getByText('A sharp sword.')).toBeTruthy();
  //   expect(getByText(`${mockItems[0].cost} Gold to purchase`)).toBeTruthy();
  // });

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
