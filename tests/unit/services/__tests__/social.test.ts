import {
  //   doc,
  //   updateDoc,
  getDoc,
  setDoc,
  //   arrayUnion,
  //   arrayRemove,
  //   collection,
  //   query,
  //   where,
  //   getDocs,
} from 'firebase/firestore';
import * as socialFunctions from '@/services/social';
import { APIResponse } from '@/types/general';
import { GetUserFriendsResponse, UserFriend } from '@/types/social';

// Mock Firebase Firestore
jest.mock('@/firebaseConfig', () => ({
  FIREBASE_DB: {},
}));

// Mock AsyncStorage methods
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve(true)),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock Firebase functions
jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  setDoc: jest.fn(),
  arrayUnion: jest.fn((item) => [item]),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  arrayRemove: jest.fn((_) => []),
  doc: jest.fn((collectionRef, id) => ({
    path: `${collectionRef.path}/${id}`,
  })),
  collection: jest.fn((db, collectionName) => ({
    withConverter: jest.fn(() => ({
      path: `${collectionName}`,
    })),
  })),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

// Mock the helper function getUserByEmail
jest.mock('@/services/social', () => ({
  ...jest.requireActual('@/services/social'),
  getUserByEmail: jest.fn(),
}));

const mockUserID = 'mockUserID';
// const mockFriendID = 'mockFriendID';
const mockUserData: UserFriend = {
  id: mockUserID,
  friends: [],
  sentRequests: [],
  pendingRequests: [],
};

describe('Social Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserFriends', () => {
    it('should return user friends successfully', async () => {
      (getDoc as jest.Mock).mockResolvedValueOnce({ data: () => mockUserData });

      const response: GetUserFriendsResponse =
        await socialFunctions.getUserFriends(mockUserID);

      expect(response).toEqual({
        success: true,
        error: null,
        data: mockUserData,
      });
    });

    it('should handle errors when user data is not found', async () => {
      (getDoc as jest.Mock).mockResolvedValueOnce({ data: () => null });

      const response: GetUserFriendsResponse =
        await socialFunctions.getUserFriends(mockUserID);

      expect(response).toEqual({
        success: false,
        error: 'Error: User friend data not found.',
        data: null,
      });
    });
  });

  describe('createUserFriends', () => {
    it('should create a new user friends document successfully', async () => {
      (setDoc as jest.Mock).mockResolvedValueOnce(undefined);

      const response: APIResponse =
        await socialFunctions.createUserFriends(mockUserID);

      expect(response).toEqual({
        data: null,
        success: true,
        error: null,
      });

      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          id: mockUserID,
          friends: [],
          sentRequests: [],
          pendingRequests: [],
        }),
      );
    });

    it('should handle errors during friend document creation', async () => {
      (setDoc as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to create document'),
      );

      const response: APIResponse =
        await socialFunctions.createUserFriends(mockUserID);

      expect(response).toEqual({
        data: null,
        success: false,
        error: 'Failed to create user friends.',
      });
    });
  });
});
