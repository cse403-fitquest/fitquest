// __tests__/auth.test.ts

import {
  signIn,
  signUp,
  isLoggedIn,
  signOut,
  FirebaseAuthErrorCodes,
} from '@/services/auth';
import { FIREBASE_AUTH } from '@/firebaseConfig';
import { FirebaseError } from 'firebase/app';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { createUser } from '@/services/user';

// Mock FIREBASE_AUTH
jest.mock('@/firebaseConfig', () => ({
  FIREBASE_AUTH: {
    currentUser: null,
    signOut: jest.fn(),
  },
}));

// Mock Firebase Auth methods
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
  signOut: jest.fn(),
}));

// Mock user.ts
jest.mock('@/services/user', () => ({
  createUser: jest.fn(),
}));

// Mock AsyncStorage methods
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve(true)),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

describe('Auth Services', () => {
  const mockSignInWithEmailAndPassword =
    signInWithEmailAndPassword as jest.Mock;
  const mockCreateUserWithEmailAndPassword =
    createUserWithEmailAndPassword as jest.Mock;
  const mockCreateUser = createUser as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    const email = 'test@example.com';
    const password = 'password123';

    it('should successfully sign in a user', async () => {
      mockSignInWithEmailAndPassword.mockResolvedValue({
        user: { uid: 'user123' },
      });

      const response = await signIn(email, password);

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        FIREBASE_AUTH,
        email,
        password,
      );
      expect(response).toEqual({
        success: true,
        data: null,
        error: null,
      });
    });

    it('should handle FirebaseError with INVALID_CREDENTIAL code', async () => {
      const firebaseError = new FirebaseError(
        FirebaseAuthErrorCodes.INVALID_CREDENTIAL,
        'Invalid credentials',
      );
      mockSignInWithEmailAndPassword.mockRejectedValue(firebaseError);

      const response = await signIn(email, password);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Invalid email or password.',
      });
    });

    it('should handle other FirebaseError codes', async () => {
      const firebaseError = new FirebaseError(
        'auth/unknown-error',
        'Unknown error',
      );
      mockSignInWithEmailAndPassword.mockRejectedValue(firebaseError);

      const response = await signIn(email, password);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error signing in. Please try again.',
      });
    });

    it('should handle generic errors', async () => {
      const genericError = new Error('Something went wrong');
      mockSignInWithEmailAndPassword.mockRejectedValue(genericError);

      const response = await signIn(email, password);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error signing in. Please try again.',
      });
    });
  });

  describe('signUp', () => {
    const username = 'newuser';
    const email = 'newuser@example.com';
    const password = 'password123';

    it('should successfully sign up a user', async () => {
      mockCreateUserWithEmailAndPassword.mockResolvedValue({
        user: { uid: 'user123' },
      });
      mockCreateUser.mockResolvedValue({
        success: true,
        data: {
          user: {
            id: 'user123',
            profileInfo: { username, email },
            createdAt: new Date(),
          },
        },
        error: null,
      });

      const response = await signUp(username, email, password);

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        FIREBASE_AUTH,
        email,
        password,
      );
      expect(createUser).toHaveBeenCalledWith('user123', username, email);
      expect(response).toEqual({
        success: true,
        data: null,
        error: null,
      });
    });

    it('should handle failure in createUser', async () => {
      mockCreateUserWithEmailAndPassword.mockResolvedValue({
        user: { uid: 'user123' },
      });
      mockCreateUser.mockResolvedValue({
        success: false,
        data: null,
        error: 'Failed to create user document.',
      });

      const response = await signUp(username, email, password);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Failed to create user document.',
      });
    });

    it('should handle FirebaseError with EMAIL_EXISTS code', async () => {
      const firebaseError = new FirebaseError(
        FirebaseAuthErrorCodes.EMAIL_EXISTS,
        'Email already in use',
      );
      mockCreateUserWithEmailAndPassword.mockRejectedValue(firebaseError);

      const response = await signUp(username, email, password);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Email already exists.',
      });
    });

    it('should handle other FirebaseError codes', async () => {
      const firebaseError = new FirebaseError(
        'auth/unknown-error',
        'Unknown error',
      );
      mockCreateUserWithEmailAndPassword.mockRejectedValue(firebaseError);

      const response = await signUp(username, email, password);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error signing up. Please try again.',
      });
    });

    it('should handle generic errors', async () => {
      const genericError = new Error('Something went wrong');
      mockCreateUserWithEmailAndPassword.mockRejectedValue(genericError);

      const response = await signUp(username, email, password);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error signing up. Please try again.',
      });
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when user is logged in', () => {
      // Mock currentUser
      Object.defineProperty(FIREBASE_AUTH, 'currentUser', {
        value: { uid: 'user123' },
        writable: true,
      });

      expect(isLoggedIn()).toBe(true);
    });

    it('should return false when no user is logged in', () => {
      // Mock currentUser
      Object.defineProperty(FIREBASE_AUTH, 'currentUser', {
        value: null,
        writable: true,
      });

      expect(isLoggedIn()).toBe(false);
    });
  });

  describe('signOut', () => {
    it('should successfully sign out a user', async () => {
      FIREBASE_AUTH.signOut = jest.fn().mockResolvedValue(undefined);

      const response = await signOut();

      expect(FIREBASE_AUTH.signOut).toHaveBeenCalled();
      expect(response).toEqual({
        success: true,
        data: null,
        error: null,
      });
    });

    it('should handle errors during sign out', async () => {
      const genericError = new Error('Sign out failed');
      FIREBASE_AUTH.signOut = jest.fn().mockRejectedValue(genericError);

      const response = await signOut();

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error signing out. Please try again.',
      });
    });
  });
});
