import { FirebaseError } from 'firebase/app';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  isEmailValid,
  signIn,
  signUp,
  isLoggedIn,
  signOut,
  FirebaseAuthErrorCodes,
} from '@/utils/auth';
import { FIREBASE_AUTH } from '@/firebaseConfig';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('@/firebaseConfig', () => ({
  FIREBASE_AUTH: {
    currentUser: null,
    signOut: jest.fn(),
  },
}));

describe('Authentication Utility Functions', () => {
  describe('isEmailValid', () => {
    it('returns true for a valid email format', () => {
      expect(isEmailValid('test@example.com')).toBe(true);
    });

    it('returns false for an invalid email format', () => {
      expect(isEmailValid('invalid-email')).toBe(false);
    });
  });

  describe('signIn', () => {
    it('signs in a user with valid credentials and returns user info', async () => {
      const mockUserCredential = { user: { uid: '12345' } };
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(
        mockUserCredential,
      );

      const response = await signIn('test@example.com', 'password123');
      expect(response).toEqual({
        userCredential: mockUserCredential,
        error: null,
      });
    });

    it('returns an error for invalid login credentials', async () => {
      const mockError = new FirebaseError(
        FirebaseAuthErrorCodes.INVALID_LOGIN_CREDENTIALS,
        'Invalid credentials',
      );
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
        mockError,
      );

      const response = await signIn('test@example.com', 'wrongpassword');
      expect(response).toEqual({
        userCredential: null,
        error: {
          general: 'Invalid email or password.',
          email: '',
          password: '',
        },
      });
    });

    it('returns an error for invalid login credentials', async () => {
      const mockError = new FirebaseError(
        'auth/invalid-login-credentials',
        'Invalid credentials',
      );
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
        mockError,
      );

      const response = await signIn('test@example.com', 'wrongpassword');
      expect(response).toEqual({
        userCredential: null,
        error: {
          general: 'Invalid email or password.',
          email: '',
          password: '',
        },
      });
    });
  });

  describe('signUp', () => {
    it('signs up a new user and returns user info', async () => {
      const mockUserCredential = { user: { uid: '12345' } };
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(
        mockUserCredential,
      );

      const response = await signUp('test@example.com', 'password123');
      expect(response).toEqual({
        userCredential: mockUserCredential,
        error: null,
      });
    });

    it('returns an error if email already exists', async () => {
      const mockError = new FirebaseError(
        FirebaseAuthErrorCodes.EMAIL_EXISTS,
        'Email already in use',
      );
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
        mockError,
      );

      const response = await signUp('test@example.com', 'password123');
      expect(response).toEqual({
        userCredential: null,
        error: {
          general: 'Email already exists.',
          username: '',
          email: '',
          password: '',
          rePassword: '',
        },
      });
    });
  });

  describe('isLoggedIn', () => {
    it('returns true if a user is logged in', () => {
      Object.defineProperty(FIREBASE_AUTH, 'currentUser', {
        value: { uid: '12345' },
        writable: true,
      });
      expect(isLoggedIn()).toBe(true);
    });

    it('returns false if no user is logged in', () => {
      Object.defineProperty(FIREBASE_AUTH, 'currentUser', {
        value: null,
        writable: true,
      });
      expect(isLoggedIn()).toBe(false);
    });
  });

  describe('signOut', () => {
    it('signs out a user successfully', async () => {
      (FIREBASE_AUTH.signOut as jest.Mock).mockResolvedValueOnce(undefined);
      const response = await signOut();
      expect(response).toEqual({
        error: null,
      });
    });

    it('returns an error if sign-out fails', async () => {
      const mockError = new Error('Sign-out error');
      (FIREBASE_AUTH.signOut as jest.Mock).mockRejectedValueOnce(mockError);

      const response = await signOut();
      expect(response).toEqual({
        error: 'Error signing out. Please try again.',
      });
    });
  });
});
