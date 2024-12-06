import { BASE_USER } from '@/constants/user';
import { User } from '@/types/user';
import { updateUserAfterExpGain } from '@/utils/workout';

describe('Workout Utility Functions', () => {
  describe('updateUserAfterExpGain', () => {
    it('should update user exp #1', () => {
      const user1: User = {
        ...BASE_USER,
        exp: 0,
      };

      const updatedUser1 = updateUserAfterExpGain(user1, 1000);

      expect(updatedUser1.exp).toBe(1000);
    });

    it('should update user exp #2', () => {
      const user1: User = {
        ...BASE_USER,
        exp: 1000,
      };

      const updatedUser1 = updateUserAfterExpGain(user1, 1000);

      expect(updatedUser1.exp).toBe(2000);
    });

    it('should update user exp #3', () => {
      const user1: User = {
        ...BASE_USER,
        exp: 2000,
      };

      const updatedUser1 = updateUserAfterExpGain(user1, 1000);

      expect(updatedUser1.exp).toBe(3000);
    });

    it('should level up a user and give them attribute points #1', () => {
      const user1: User = {
        ...BASE_USER,
        exp: 3000,
      };

      const updatedUser1 = updateUserAfterExpGain(user1, 1000);

      expect(updatedUser1.exp).toBe(0);
      expect(updatedUser1.attributePoints).toBe(1);
    });

    it('should level up a user and give them attribute points #1', () => {
      const user1: User = {
        ...BASE_USER,
        exp: 3000,
      };

      const updatedUser1 = updateUserAfterExpGain(user1, 2000);

      expect(updatedUser1.exp).toBe(1000);
      expect(updatedUser1.attributePoints).toBe(1);
    });

    it('should level up a user and give them attribute points #2', () => {
      const user1: User = {
        ...BASE_USER,
        exp: 3000,
      };

      const updatedUser1 = updateUserAfterExpGain(user1, 3000);

      expect(updatedUser1.exp).toBe(2000);
      expect(updatedUser1.attributePoints).toBe(1);
    });

    it('should level up a user and give them attribute points multiple times #1', () => {
      const user1: User = {
        ...BASE_USER,
        exp: 0,
      };

      const updatedUser1 = updateUserAfterExpGain(user1, 9000);

      expect(updatedUser1.attributePoints).toBe(2);
    });

    it('should level up a user and give them attribute points multiple times #2', () => {
      const user1: User = {
        ...BASE_USER,
        exp: 0,
      };

      const updatedUser1 = updateUserAfterExpGain(user1, 15000);

      expect(updatedUser1.attributePoints).toBe(3);
    });
  });
});
