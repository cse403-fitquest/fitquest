// tests for the onboarding utility functions
import { computeFitnessLevel } from '@/utils/onboarding';

describe('Onboarding Utility Functions', () => {
  describe('computeFitnessLevel', () => {
    it('computes the fitness level based on the input values', () => {
      const fitnessLevel = computeFitnessLevel(3, 2, 4, 1);
      expect(fitnessLevel).toBe(2.5);
    });
  });
});
