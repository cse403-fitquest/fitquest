export const computeFitnessLevel = (
  frequency: 0 | 1 | 2 | 3 | 4,
  length: 0 | 1 | 2 | 3 | 4,
  intensity: 0 | 1 | 2 | 3 | 4,
  experience: 0 | 1 | 2 | 3 | 4,
): number => {
  return (frequency + length + intensity + experience) / 4;
};
