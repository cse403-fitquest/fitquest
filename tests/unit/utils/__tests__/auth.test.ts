// tests for the auth utility functions
import { isEmailValid } from '@/utils/auth';

describe('Auth Utility Functions', () => {
  describe('isEmailValid', () => {
    it('returns true for valid email', () => {
      const validEmail = 'validemail@mail.com';
      expect(isEmailValid(validEmail)).toBe(true);
    });

    it('returns false for invalid email', () => {
      const invalidEmail = 'invalid-email';
      expect(isEmailValid(invalidEmail)).toBe(false);
    });
  });
});
