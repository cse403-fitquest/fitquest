// __tests__/item.test.ts

import { fetchItems, setItemsInDB, purchaseItem } from '@/services/item';
import { FirebaseError } from 'firebase/app';
import {
  getDocs,
  deleteDoc,
  writeBatch,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { Item } from '@/types/item';
import { APIResponse } from '@/types/general';
import { BASE_ITEM } from '@/constants/item';
import { GetItemsResponse } from '@/types/item';
import { BASE_USER } from '@/constants/user';

// Mock Firebase Firestore
jest.mock('@/firebaseConfig', () => ({
  FIREBASE_DB: {},
}));

// Mock Firebase Firestore methods
jest.mock('firebase/firestore', () => ({
  collection: jest.fn((_db, collectionName) => ({
    withConverter: jest.fn(() => ({
      path: `${collectionName}`,
    })),
  })),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  writeBatch: jest.fn(() => ({
    set: jest.fn(),
    commit: jest.fn(),
  })),
  doc: jest.fn((collectionRef, id) => ({
    path: `${collectionRef.path}/${id}`,
  })),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn((item) => [item]), // Mock arrayUnion to return an array with the item
}));

describe('Item Service Functions', () => {
  const mockGetDocs = getDocs as jest.Mock;
  const mockDeleteDoc = deleteDoc as jest.Mock;
  const mockWriteBatch = writeBatch as jest.Mock;
  const mockGetDoc = getDoc as jest.Mock;
  const mockUpdateDoc = updateDoc as jest.Mock;

  const itemCollection = [{ ...BASE_ITEM }] as Item[];
  const userData = {
    ...BASE_USER,
    id: 'user123',
    gold: 200,
    equipments: [],
    consumables: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchItems', () => {
    it('should return items successfully', async () => {
      mockGetDocs.mockResolvedValue({
        docs: itemCollection.map((item) => ({ data: () => item })),
      });

      const response: GetItemsResponse = await fetchItems();
      expect(response).toEqual({
        success: true,
        data: itemCollection,
        error: null,
      });
    });

    it('should return an error when fetching items fails', async () => {
      mockGetDocs.mockRejectedValue(
        new FirebaseError('permission-denied', 'Permission denied'),
      );

      const response: GetItemsResponse = await fetchItems();
      expect(response).toEqual({
        success: false,
        data: [],
        error: 'Error getting items.',
      });
    });
  });

  describe('setItemsInDB', () => {
    it('should set items in the database successfully', async () => {
      mockGetDocs.mockResolvedValue({
        docs: itemCollection.map(() => ({ ref: {} })),
      });
      mockDeleteDoc.mockResolvedValue(undefined);
      const mockBatchCommit = jest.fn();
      mockWriteBatch.mockReturnValue({
        set: jest.fn(),
        commit: mockBatchCommit,
      });

      const response: APIResponse = await setItemsInDB(itemCollection);

      expect(mockDeleteDoc).toHaveBeenCalledTimes(itemCollection.length);
      expect(mockBatchCommit).toHaveBeenCalled();
      expect(response).toEqual({
        success: true,
        data: null,
        error: null,
      });
    });

    it('should return an error if setting items fails', async () => {
      mockGetDocs.mockRejectedValue(
        new FirebaseError('permission-denied', 'Permission denied'),
      );

      const response: APIResponse = await setItemsInDB(itemCollection);
      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error setting items.',
      });
    });
  });

  describe('purchaseItem', () => {
    const itemId = 'item1';
    const item = {
      ...BASE_ITEM,
      id: itemId,
      name: 'Sword',
      cost: 50,
      type: 'EQUIPMENT',
    };
    const userId = 'user123';

    it('should complete purchase successfully', async () => {
      // Mock getDoc to return item data for the item and user data for the user
      mockGetDoc.mockImplementation((ref) => {
        if (ref.path.includes('items')) return { data: () => item };
        if (ref.path.includes('users')) return { data: () => userData };
      });

      // Mock updateDoc to resolve without returning any data
      mockUpdateDoc.mockResolvedValue(undefined);

      const response: APIResponse = await purchaseItem(userId, itemId);

      expect(response).toEqual({
        success: true,
        data: null,
        error: null,
      });
    });

    it('should fail purchase if user has insufficient balance', async () => {
      const userWithLowBalance = { ...userData, gold: 20 };
      mockGetDoc.mockImplementation((ref) => {
        if (ref.path.includes('items')) return { data: () => item };
        if (ref.path.includes('users'))
          return { data: () => userWithLowBalance };
      });

      const response: APIResponse = await purchaseItem(userId, item.id);
      expect(response.success).toEqual(false);
    });

    it('should return an error if fetching item or user data fails', async () => {
      mockGetDoc.mockRejectedValue(
        new FirebaseError('not-found', 'Item not found'),
      );

      const response: APIResponse = await purchaseItem(userId, item.id);
      expect(response.success).toEqual(false);
    });
  });
});
