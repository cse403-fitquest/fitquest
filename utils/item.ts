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
