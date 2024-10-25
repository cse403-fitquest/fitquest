import { FlatList, ScrollView, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Item, ItemType } from '@/types/item';
import { filterItemsByTypeAndSortByCost } from '@/utils/item';
import clsx from 'clsx';

const currentDate = new Date();

const MOCK_ITEMS: Item[] = [
  {
    id: 'fesfsgggdes',
    type: ItemType.WEAPON,
    name: 'Sword',
    power: 10,
    speed: 7,
    health: 0,
    cost: 50,
    spriteID: 'sword',
    createdAt: currentDate,
  },
  {
    id: 'fsgfargergghs',
    type: ItemType.WEAPON,
    name: 'Axe',
    power: 15,
    speed: 5,
    health: 0,
    cost: 75,
    spriteID: 'sword',
    createdAt: currentDate,
  },
  {
    id: 'y4ejrtasg',
    type: ItemType.WEAPON,
    name: 'Short Bow',
    power: 10,
    speed: 7,
    health: 3,
    cost: 75,
    spriteID: 'sword',
    createdAt: currentDate,
  },
  {
    id: 'gdsgsdg',
    type: ItemType.WEAPON,
    name: 'Long Bow',
    power: 20,
    speed: 1,
    health: 0,
    cost: 75,
    spriteID: 'sword',
    createdAt: currentDate,
  },
  {
    id: 'hdhthtrjj',
    type: ItemType.ARMOR,
    name: 'Leather Armor',
    power: 0,
    speed: 2,
    health: 10,
    cost: 50,
    spriteID: 'sword',
    createdAt: currentDate,
  },
  {
    id: 'rjrjt',
    type: ItemType.ARMOR,
    name: 'Chainmail Armor',
    power: 0,
    speed: 10,
    health: 10,
    cost: 75,
    spriteID: 'sword',
    createdAt: currentDate,
  },
  {
    id: 'gw5ye3he5h',
    type: ItemType.ARMOR,
    name: 'Steel Armor',
    power: 0,
    speed: 5,
    health: 15,
    cost: 100,
    spriteID: 'sword',
    createdAt: currentDate,
  },
  {
    id: 'rherheb',
    type: ItemType.ACCESSORY,
    name: 'Rock Pendant',
    power: 5,
    speed: 0,
    health: 5,
    cost: 100,
    spriteID: 'sword',
    createdAt: currentDate,
  },
  {
    id: 'afea4twegwerg',
    type: ItemType.ACCESSORY,
    name: 'Fire Pendant',
    power: 5,
    speed: 5,
    health: 0,
    cost: 100,
    spriteID: 'sword',
    createdAt: currentDate,
  },
  {
    id: 'gssgsgsgs',
    type: ItemType.POTION_SMALL,
    name: 'Small Health Potion',
    power: 0,
    speed: 0,
    health: 0,
    cost: 50,
    spriteID: 'sword',
    createdAt: currentDate,
  },
  {
    id: 'gssgsgsgsdsfs',
    type: ItemType.POTION_MEDIUM,
    name: 'Medium Health Potion',
    power: 0,
    speed: 0,
    health: 0,
    cost: 75,
    spriteID: 'sword',
    createdAt: currentDate,
  },
  {
    id: 'gssgfsfsasgsgs',
    type: ItemType.POTION_LARGE,
    name: 'Large Health Potion',
    power: 0,
    speed: 0,
    health: 0,
    cost: 100,
    spriteID: 'sword',
    createdAt: currentDate,
  },
];

const Shop = () => {
  return (
    <SafeAreaView className="relative flex-1 items-center h-full bg-off-white">
      <ScrollView className="w-full h-full px-6 py-8">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl text-gray-black mb-5">Shop</Text>
          <Text className="text-lg text-gold mb-5 font-semibold">500 Gold</Text>
        </View>

        <View className="w-full  mb-5">
          <Text className="text-xl text-gray-black font-bold mb-2">
            WEAPONS
          </Text>
          <FlatList
            data={filterItemsByTypeAndSortByCost(MOCK_ITEMS, ItemType.WEAPON)}
            renderItem={({ item }) => <ItemCard item={item} />}
            ItemSeparatorComponent={() => <View className="w-3" />}
            className="grow-0 m-0"
            keyExtractor={(item) => item.id}
            horizontal
          />
        </View>

        <View className="w-full  mb-5">
          <Text className="text-xl text-gray-black font-bold mb-2">ARMORS</Text>
          <FlatList
            data={filterItemsByTypeAndSortByCost(MOCK_ITEMS, ItemType.ARMOR)}
            renderItem={({ item }) => <ItemCard item={item} />}
            ItemSeparatorComponent={() => <View className="w-3" />}
            className="grow-0 m-0"
            horizontal
          />
        </View>

        <View className="w-full  mb-5">
          <Text className="text-xl text-gray-black font-bold mb-2">
            ACCESSORIES
          </Text>
          <FlatList
            data={filterItemsByTypeAndSortByCost(
              MOCK_ITEMS,
              ItemType.ACCESSORY,
            )}
            renderItem={({ item }) => <ItemCard item={item} />}
            ItemSeparatorComponent={() => <View className="w-3" />}
            className="grow-0 m-0"
            horizontal
          />
        </View>

        <View className="w-full  mb-5">
          <Text className="text-xl text-gray-black font-bold mb-2">
            POTIONS
          </Text>
          <View className="flex-row gap-3">
            <FlatList
              data={filterItemsByTypeAndSortByCost(
                MOCK_ITEMS,
                ItemType.POTION_SMALL,
              )}
              renderItem={({ item }) => <ItemCard item={item} />}
              ItemSeparatorComponent={() => <View className="w-3" />}
              className="grow-0 m-0"
              horizontal
            />
            <FlatList
              data={filterItemsByTypeAndSortByCost(
                MOCK_ITEMS,
                ItemType.POTION_MEDIUM,
              )}
              renderItem={({ item }) => <ItemCard item={item} />}
              ItemSeparatorComponent={() => <View className="w-3" />}
              className="grow-0 m-0"
              horizontal
            />
            <FlatList
              data={filterItemsByTypeAndSortByCost(
                MOCK_ITEMS,
                ItemType.POTION_LARGE,
              )}
              renderItem={({ item }) => <ItemCard item={item} />}
              ItemSeparatorComponent={() => <View className="w-3" />}
              className="grow-0 m-0"
              horizontal
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Shop;

const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
  return (
    <View className="flex-col justify-center items-center">
      <View
        className={clsx(
          'rounded w-24 h-24 border border-gray bg-white shadow-lg shadow-black mb-2',
          {
            'bg-red-800': item.type === ItemType.WEAPON,
            'bg-blue': item.type === ItemType.ARMOR,
            'bg-green': item.type === ItemType.ACCESSORY,
            'bg-pink': [
              ItemType.POTION_SMALL,
              ItemType.POTION_MEDIUM,
              ItemType.POTION_LARGE,
            ].includes(item.type),
          },
        )}
      ></View>
      <Text className="text-lg text-gold mb-5 font-semibold">
        {item.cost} Gold
      </Text>
    </View>
  );
};
