import { Item, ItemType } from '@/types/item';

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
  items: Item[],
) => [number, number, number] = (items) => {
  const smallHealthPotions = filterItemsByType(items, ItemType.POTION_SMALL);
  const mediumHealthPotions = filterItemsByType(items, ItemType.POTION_MEDIUM);
  const largeHealthPotions = filterItemsByType(items, ItemType.POTION_LARGE);

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
