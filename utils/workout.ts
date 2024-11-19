import { User } from '@/types/user';
import { getUserExpThreshold } from './user';

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
