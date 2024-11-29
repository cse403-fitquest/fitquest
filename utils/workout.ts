import { User } from '@/types/user';
import { getUserExpThreshold } from './user';
import { ExerciseDisplay, ExerciseTag, WorkoutTemplate } from '@/types/workout';


/* converts seconds to xminutes xseconds so for display purposes*/
export const secondsToMinutes = (seconds: number) => {
  return Math.floor(seconds / 60) + 'm' + (seconds % 60) + 's';
};

export const addToTemplate = () => {};
export const removeFromTemplate = () => {};
export const submitTemplate = () => {};
export const resetTemplate = () => {};

export const updateUserAfterExpGain = (user: User, expGain: number): User => {
  // Check if user's exp is enough to level up

  const newUser: User = { ...user };
  let exp = user.exp + expGain;

  let expThreshold = getUserExpThreshold(newUser);

  if (exp < expThreshold) {
    newUser.exp = exp;
    return newUser;
  }

  while (exp >= expThreshold) {
    // Level up
    newUser.attributePoints += 1;
    exp -= expThreshold;
    newUser.exp = exp;
    expThreshold = getUserExpThreshold(newUser);
  }

  return newUser;
};

export const addToUserWorkouts = (user: User, workout: WorkoutTemplate): User => {
  const newUser: User = {...user};
  //if the workout with same name is already in my templates
  if (
    user.savedWorkouts
      .map((template) => template.title)
      .includes(workout.title)
  ) {
    throw new Error(
      'Workout with title: ' + workout.title + ' already exists',
    );
  }
  console.log(
    'Successfully added ' + workout.title + ' to saved templates',
  );
  newUser.savedWorkouts = [...user.savedWorkouts, workout];
  return newUser;

}

// Helper function to print exercise display
export const printExerciseDisplays = (exercises: ExerciseDisplay[]) => {
  for (const exercise of exercises) {
    console.log(exercise.name);
    for (const set of exercise.sets) {
      // Print only relevant tags

      let str =
        'ID: ' +
        set.id.slice(0, 5) +
        ' | Set ' +
        (exercise.sets.indexOf(set) + 1) +
        ': ';
      if (exercise.tags.includes(ExerciseTag.WEIGHT)) {
        str += `WEIGHT: ${set.weight} `;
      }
      if (exercise.tags.includes(ExerciseTag.REPS)) {
        str += `REPS: ${set.reps} `;
      }
      if (exercise.tags.includes(ExerciseTag.DISTANCE)) {
        str += `DISTANCE: ${set.distance} `;
      }
      if (exercise.tags.includes(ExerciseTag.TIME)) {
        str += `TIME: ${set.time} `;
      }

      console.log(str);
    }
  }
};
