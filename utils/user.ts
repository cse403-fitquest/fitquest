import { Item } from '@/types/item';
import { User } from '@/types/user';

export const getUserExpThreshold = (user: User) => {
  return (
    user.attributes.power * 100 +
    user.attributes.speed * 100 +
    user.attributes.health * 100 +
    user.attributePoints * 100
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
