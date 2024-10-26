import { Item, ItemType } from '@/types/item';
import {
  filterItemsByTypeAndSortByCost,
  isItemConsumable,
  itemTypeToString,
} from '@/utils/item';

describe('Item Utility Functions', () => {
  const items: Item[] = [
    {
      id: '1',
      type: ItemType.WEAPON,
      name: 'Sword',
      description: 'A sharp blade.',
      power: 10,
      speed: 7,
      health: 0,
      spriteID: 'swordSprite',
      cost: 100,
      createdAt: new Date(),
    },
    {
      id: '2',
      type: ItemType.ARMOR,
      name: 'Steel Armor',
      description: 'Protective armor.',
      power: 0,
      speed: 5,
      health: 20,
      spriteID: 'armorSprite',
      cost: 150,
      createdAt: new Date(),
    },
    {
      id: '3',
      type: ItemType.POTION_SMALL,
      name: 'Small Health Potion',
      description: 'Restores a small amount of health.',
      power: 0,
      speed: 0,
      health: 20,
      spriteID: 'potionSprite',
      cost: 25,
      createdAt: new Date(),
    },
  ];

  describe('filterItemsByTypeAndSortByCost', () => {
    it('filters items by specified type and sorts by cost in ascending order', () => {
      const filteredItems = filterItemsByTypeAndSortByCost(
        items,
        ItemType.WEAPON,
      );
      expect(filteredItems).toHaveLength(1);
      expect(filteredItems[0].type).toBe(ItemType.WEAPON);
      expect(filteredItems[0].cost).toBe(100);
    });

    it('returns an empty array if no items of specified type are found', () => {
      const filteredItems = filterItemsByTypeAndSortByCost(
        items,
        ItemType.ACCESSORY,
      );
      expect(filteredItems).toHaveLength(0);
    });
  });

  describe('isItemConsumable', () => {
    it('returns true if item is of type POTION_SMALL', () => {
      const result = isItemConsumable(items[2]);
      expect(result).toBe(true);
    });

    it('returns false if item is not a consumable type', () => {
      const result = isItemConsumable(items[0]);
      expect(result).toBe(false);
    });
  });

  describe('itemTypeToString', () => {
    it('converts ItemType.WEAPON to "Weapon"', () => {
      expect(itemTypeToString(ItemType.WEAPON)).toBe('Weapon');
    });

    it('converts ItemType.POTION_SMALL to "Potion"', () => {
      expect(itemTypeToString(ItemType.POTION_SMALL)).toBe('Potion');
    });

    it('returns an empty string for unknown item types', () => {
      expect(itemTypeToString('UNKNOWN' as ItemType)).toBe('');
    });
  });
});
