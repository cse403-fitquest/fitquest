import { User } from '@/types/user';
import { getUserExpThreshold } from './user';
import { ExerciseDisplay, ExerciseTag, Workout } from '@/types/workout';

/* converts seconds to xminutes xseconds so for display purposes*/
export const secondsToMinutes = (seconds: number) => {
  return Math.floor(seconds / 60) + 'm' + (seconds % 60) + 's';
};

export const convertSecondsToMMSS = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  let minutesString = minutes.toString();
  let remainingSecondsString = remainingSeconds.toString();

  if (minutes < 10) {
    minutesString = `0${minutes}`;
  }

  if (remainingSeconds < 10) {
    remainingSecondsString = `0${remainingSeconds}`;
  }

  return `${minutesString}:${remainingSecondsString}`;
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

export const getTagColumnWidth = (tag: ExerciseTag) => {
  switch (tag) {
    case ExerciseTag.WEIGHT:
      return 100;
    case ExerciseTag.REPS:
      return 80;
    case ExerciseTag.DISTANCE:
      return 100;
    case ExerciseTag.TIME:
      return 80;
    default:
      return 100;
  }
};

export const turnTagIntoString = (tag: ExerciseTag) => {
  switch (tag) {
    case ExerciseTag.WEIGHT:
      return 'WEIGHT (lbs)';
    case ExerciseTag.REPS:
      return 'REPS';
    case ExerciseTag.DISTANCE:
      return 'DISTANCE (ft)';
    case ExerciseTag.TIME:
      return 'TIME';
  }
};

export const addToUserWorkouts = (user: User, workout: Workout): User => {
  const newUser: User = { ...user };
  //if the workout with same name is already in my templates
  if (
    user.savedWorkouts.map((template) => template.title).includes(workout.title)
  ) {
    throw new Error('Workout with title: ' + workout.title + ' already exists');
  }

  let found = false;
  // If no workout is found, add the workout to the user's savedWorkoutTemplates
  if (newUser.savedWorkoutTemplates.find((w) => w.id === workout.id)) {
    found = true;
  }

  if (found) {
    // Update the workout if it already exists
    newUser.savedWorkoutTemplates = newUser.savedWorkoutTemplates.map((w) =>
      w.id === workout.id ? workout : w,
    );

    console.log('Successfully edited ' + workout.title + ' to saved templates');

    return newUser;
  }

  console.log('Successfully added ' + workout.title + ' to saved templates');

  newUser.savedWorkoutTemplates = [...user.savedWorkoutTemplates, workout];
  return newUser;
};

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

export const didUserLevelUp = (oldUser: User, newUser: User) => {
  // Compare user's aggregate attributes
  const oldPoints =
    oldUser.attributes.power +
    oldUser.attributes.speed +
    oldUser.attributes.health +
    oldUser.attributePoints;

  const newPoints =
    newUser.attributes.power +
    newUser.attributes.speed +
    newUser.attributes.health +
    newUser.attributePoints;

  return newPoints > oldPoints;
};
