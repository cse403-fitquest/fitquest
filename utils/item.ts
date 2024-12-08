import { Item, ItemType } from '@/types/item';
import { User } from '@/types/user';

const filterItemsByType: (items: Item[], type: ItemType) => Item[] = (
  items,
  type,
) => {
  return items.filter((item) => item.type === type);
};

const sortItemsByCost: (items: Item[]) => Item[] = (items) => {
  return items.sort((a, b) => a.cost - b.cost);
};

export const filterItemsByTypeAndSortByCost: (
  items: Item[],
  type: ItemType,
) => Item[] = (items, type) => {
  return sortItemsByCost(filterItemsByType(items, type));
};

export const isItemConsumable: (item: Item) => boolean = (item) => {
  return (
    item.type === ItemType.POTION_SMALL ||
    item.type === ItemType.POTION_MEDIUM ||
    item.type === ItemType.POTION_LARGE
  );
};

export const getUserHealthPotionsCountFromItems: (
  user: User,
  allItems: Item[],
) => [number, number, number] = (user, allItems) => {
  const userConsumables: (Item | null)[] = user.consumables.map((id) => {
    const consumable = allItems.find((item) => item.id === id);
    if (!consumable) {
      console.error('User consumable not found:', id);
      return null;
    }
    return consumable;
  });

  const smallHealthPotions = userConsumables.filter(
    (item) => item?.type === ItemType.POTION_SMALL,
  );
  const mediumHealthPotions = userConsumables.filter(
    (item) => item?.type === ItemType.POTION_MEDIUM,
  );
  const largeHealthPotions = userConsumables.filter(
    (item) => item?.type === ItemType.POTION_LARGE,
  );

  return [
    smallHealthPotions.length,
    mediumHealthPotions.length,
    largeHealthPotions.length,
  ];
};

export const itemTypeToString = (type: ItemType): string => {
  switch (type) {
    case ItemType.WEAPON:
      return 'Weapon';
    case ItemType.ARMOR:
      return 'Armor';
    case ItemType.ACCESSORY:
      return 'Accessory';
    case ItemType.POTION_SMALL:
    case ItemType.POTION_MEDIUM:
    case ItemType.POTION_LARGE:
      return 'Potion';
    default:
      return '';
  }
};
