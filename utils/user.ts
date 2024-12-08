import { Item } from '@/types/item';
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

export const getUserTotalAttributes = (user: User, allItems: Item[]) => {
  // Base stats from user profile
  let computedPower = user.attributes.power;
  let computedHealth = user.attributes.health;
  let computedSpeed = user.attributes.speed;

  // Fetch equipped items
  const equipped = allItems.filter((item) =>
    user.equippedItems.includes(item.id),
  );

  equipped.forEach((item) => {
    computedPower += item.power;
    computedHealth += item.health;
    computedSpeed += item.speed;
  });

  return {
    power: computedPower,
    health: computedHealth,
    speed: computedSpeed,
  };
};
