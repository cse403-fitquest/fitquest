import { BASE_USER } from '@/constants/user';
import { User } from '@/types/user';
import { getUserExpThreshold } from '@/utils/user';

describe('User Utility Functions', () => {
  describe('getUserExpThreshold', () => {
    it('should return the correct exp threshold #1', () => {
      const user: User = {
        ...BASE_USER,
        attributes: {
          power: 5,
          speed: 5,
          health: 5,
        },
        attributePoints: 0,
      };

      const expThreshold = getUserExpThreshold(user);

      expect(expThreshold).toBe(4000);
    });

    it('should return the correct exp threshold #2', () => {
      const user: User = {
        ...BASE_USER,
        attributes: {
          power: 5,
          speed: 5,
          health: 5,
        },
        attributePoints: 1,
      };

      const expThreshold = getUserExpThreshold(user);

      expect(expThreshold).toBe(4200);
    });

    it('should return the correct exp threshold #3', () => {
      const user: User = {
        ...BASE_USER,
        attributes: {
          power: 6,
          speed: 6,
          health: 6,
        },
        attributePoints: 1,
      };

      const expThreshold = getUserExpThreshold(user);

      expect(expThreshold).toBe(4800);
    });

    it('should return the correct exp threshold #4', () => {
      const user: User = {
        ...BASE_USER,
        attributes: {
          power: 6,
          speed: 6,
          health: 6,
        },
        attributePoints: 2,
      };

      const expThreshold = getUserExpThreshold(user);

      expect(expThreshold).toBe(5000);
    });

    it('should return the correct exp threshold #5', () => {
      const user: User = {
        ...BASE_USER,
        attributes: {
          power: 10,
          speed: 10,
          health: 10,
        },
        attributePoints: 5,
      };

      const expThreshold = getUserExpThreshold(user);

      expect(expThreshold).toBe(8000);
    });

    it('should return the correct exp threshold #6', () => {
      const user: User = {
        ...BASE_USER,
        attributes: {
          power: 20,
          speed: 20,
          health: 20,
        },
        attributePoints: 0,
      };

      const expThreshold = getUserExpThreshold(user);

      expect(expThreshold).toBe(13000);
    });

    it('should return the correct exp threshold #7', () => {
      const user: User = {
        ...BASE_USER,
        attributes: {
          power: 40,
          speed: 40,
          health: 40,
        },
        attributePoints: 0,
      };

      const expThreshold = getUserExpThreshold(user);

      expect(expThreshold).toBe(25000);
    });
  });
});
