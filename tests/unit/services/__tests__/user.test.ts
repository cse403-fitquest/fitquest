// __tests__/user.test.ts

import { createUser, getUser, updateUserProfile } from '@/services/user';
import { FirebaseError } from 'firebase/app';
import { setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { BASE_USER } from '@/constants/user';
import { CreateUserResponse, GetUserResponse, User } from '@/types/user';
import { getUserByUsername } from '@/services/user.helper';

// Mock Firebase Firestore
jest.mock('@/firebaseConfig', () => ({
  FIREBASE_DB: {},
}));

// Mock Firebase Firestore methods
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => ({
    withConverter: jest.fn(() => 'mockedCollection'),
  })),
  doc: jest.fn(() => 'mockedDoc'),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

// Mock AsyncStorage methods
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve(true)),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock user helper functions
jest.mock('@/services/user.helper', () => ({
  getUserByUsername: jest.fn(),
}));

describe('User Service Functions', () => {
  const mockSetDoc = setDoc as jest.Mock;
  const mockGetDoc = getDoc as jest.Mock;
  const mockUpdateDoc = updateDoc as jest.Mock;
  const mockGetUserByUsername = getUserByUsername as jest.Mock;

  const id = 'user123';
  const username = 'testuser';
  const email = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should return a successful response when user is created', async () => {
      // Mock the expected user structure based on BASE_USER
      const expectedUser = {
        ...BASE_USER,
        id,
        profileInfo: { ...BASE_USER.profileInfo, username, email },
        createdAt: expect.any(Date),
      };

      mockSetDoc.mockResolvedValue(undefined);

      const response: CreateUserResponse = await createUser(
        id,
        username,
        email,
      );

      expect(mockSetDoc).toHaveBeenCalledWith('mockedDoc', expectedUser);
      expect(response).toEqual({
        success: true,
        data: { user: expectedUser },
        error: null,
      });
    });

    it('should return an error response for FirebaseError', async () => {
      const firebaseError = new FirebaseError(
        'permission-denied',
        'Permission denied',
      );
      mockSetDoc.mockRejectedValue(firebaseError);

      const response: CreateUserResponse = await createUser(
        id,
        username,
        email,
      );

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error creating user with Firestore. Please try again.',
      });
    });

    it('should return an error response for general errors', async () => {
      const genericError = new Error('Something went wrong');
      mockSetDoc.mockRejectedValue(genericError);

      const response: CreateUserResponse = await createUser(
        id,
        username,
        email,
      );

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error creating user. Please try again.',
      });
    });
  });

  describe('getUser', () => {
    const mockUserData = {
      ...BASE_USER,
      id,
      profileInfo: { ...BASE_USER.profileInfo, username, email },
      createdAt: new Date(),
    };

    it('should return a successful response when user is found', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockUserData,
      });

      const response: GetUserResponse = await getUser(id);

      expect(response).toEqual({
        success: true,
        data: { user: mockUserData },
        error: null,
      });
    });

    it('should return an error response when user is not found', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      const response: GetUserResponse = await getUser(id);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error getting user. Please try again.',
      });
    });

    it('should return an error response for FirebaseError', async () => {
      const firebaseError = new FirebaseError('not-found', 'User not found');
      mockGetDoc.mockRejectedValue(firebaseError);

      const response: GetUserResponse = await getUser(id);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error getting user with Firestore. Please try again.',
      });
    });

    it('should return an error response for general errors', async () => {
      const genericError = new Error('Something went wrong');
      mockGetDoc.mockRejectedValue(genericError);

      const response: GetUserResponse = await getUser(id);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error getting user. Please try again.',
      });
    });
  });

  describe('updateUserProfile', () => {
    it('should update partial profile info successfully', async () => {
      // Mock getUserByUsername
      mockGetUserByUsername.mockResolvedValue({
        success: false,
        data: null,
        error: null,
      });

      const userId = 'user123';
      const updates: Partial<User> = {
        profileInfo: {
          ...BASE_USER.profileInfo,
          username: 'newuser',
          height: 180,
          weight: 75,
        },
      };

      mockUpdateDoc.mockResolvedValue(undefined);

      const response = await updateUserProfile(userId, updates);

      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), updates);
      expect(response).toEqual({
        success: true,
        data: null,
        error: null,
      });
    });

    it('should handle empty update object', async () => {
      const userId = 'user123';
      const updates = {};

      mockUpdateDoc.mockResolvedValue(undefined);

      const response = await updateUserProfile(userId, updates);

      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), updates);
      expect(response).toEqual({
        success: true,
        data: null,
        error: null,
      });
    });

    it('should update multiple fields successfully', async () => {
      const userId = 'user123';
      const updates = {
        currentQuest: {
          id: 'quest123',
          progress: { quest123: 50 },
        },
        gold: 100,
      };

      mockUpdateDoc.mockResolvedValue(undefined);

      const response = await updateUserProfile(userId, updates);

      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), updates);
      expect(response).toEqual({
        success: true,
        data: null,
        error: null,
      });
    });

    it('should handle generic error gracefully', async () => {
      const userId = 'user123';
      const updates = { gold: 100 };

      mockUpdateDoc.mockRejectedValue(new Error('Network error'));

      const response = await updateUserProfile(userId, updates);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Failed to update profile. Please try again.',
      });
    });
  });
});
