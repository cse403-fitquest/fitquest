// tests for the onboarding utility functions
import { FitnessLevel } from '@/types/onboarding';
import { computeFitnessLevel } from '@/utils/onboarding';

describe('Onboarding Utility Functions', () => {
  describe('computeFitnessLevel', () => {
    it('computes the fitness level - beginner', () => {
      expect(computeFitnessLevel(1, 1, 1, 1)).toBe(FitnessLevel.BEGINNER);
      expect(computeFitnessLevel(1, 1, 1, 2)).toBe(FitnessLevel.BEGINNER);
    });

    it('computes the fitness level - novice', () => {
      expect(computeFitnessLevel(1, 1, 2, 2)).toBe(FitnessLevel.NOVICE);
      expect(computeFitnessLevel(1, 2, 2, 2)).toBe(FitnessLevel.NOVICE);
      expect(computeFitnessLevel(2, 2, 3, 2)).toBe(FitnessLevel.NOVICE);
    });
    it('computes the fitness level - intermediate', () => {
      expect(computeFitnessLevel(2, 2, 3, 3)).toBe(FitnessLevel.INTERMEDIATE);
      expect(computeFitnessLevel(3, 3, 3, 3)).toBe(FitnessLevel.INTERMEDIATE);
      expect(computeFitnessLevel(3, 3, 3, 4)).toBe(FitnessLevel.INTERMEDIATE);
    });

    it('computes the fitness level - advanced', () => {
      expect(computeFitnessLevel(3, 3, 4, 4)).toBe(FitnessLevel.ADVANCED);
      expect(computeFitnessLevel(3, 4, 4, 4)).toBe(FitnessLevel.ADVANCED);
      expect(computeFitnessLevel(4, 4, 4, 4)).toBe(FitnessLevel.ADVANCED);
    });
  });
});
