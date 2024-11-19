import { User } from '@/types/user';

export const getUserExpThreshold = (user: User) => {
  return (
    1000 + // Base exp
    user.attributes.power * 200 +
    user.attributes.speed * 200 +
    user.attributes.health * 200 +
    user.attributePoints * 200
  );
};
