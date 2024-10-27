import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Item, ItemType } from '@/types/item';
import {
  filterItemsByTypeAndSortByCost,
  isItemConsumable,
  itemTypeToString,
} from '@/utils/item';
import clsx from 'clsx';
import FQModal from '@/components/FQModal';

const currentDate = new Date();

const MOCK_ITEMS: Item[] = [
  {
    id: 'fesfsgggdes',
    type: ItemType.WEAPON,
    name: 'Sword',
    description: 'Sharp enough to solve most problems, but not all of them.',
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
    description: "For when subtlety just isn't in your vocabulary.",
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
    description: "Ideal for hitting things you don't want to get too close to.",
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
    description: "Turns 'social distancing' into an art form.",
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
    description: 'Soft on comfort, light on life-saving durability.',
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
    description: 'Adds just enough jingle to scare off silent approaches.',
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
    description: 'Feels like a hug… from a very heavy robot.',
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
    description: 'Solid, dependable, and guaranteed to be hard as a rock.',
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
    description: 'Adds a little heat to your style… and maybe your enemies.',
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
    description: 'Heals 10% of max health. A sip-sized fix for small troubles.',
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
    description:
      'Heals 15% of max health. For those medium-level problems in life (and death).',
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
    description: "Heals 20% of max health. A full dose of 'not today, death!'",
    power: 0,
    speed: 0,
    health: 0,
    cost: 100,
    spriteID: 'sword',
    createdAt: currentDate,
  },
];

const Shop = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const modalChildren = useMemo(() => {
    if (!selectedItem) return null;

    if (
      [ItemType.WEAPON, ItemType.ARMOR, ItemType.ACCESSORY].includes(
        selectedItem.type,
      )
    ) {
      return (
        <View>
          <View className="justify-center items-center h-24 my-5">
            <Text>Item Sprite Here</Text>
          </View>
          <Text className="mb-5">{selectedItem.description}</Text>
          <View className="flex-row justify-evenly items-center mb-5">
            <View>
              <Text className="font-medium">Power:</Text>
              <Text className="font-medium">Speed:</Text>
              <Text className="font-medium">Health:</Text>
            </View>
            <View className="justify-center items-center">
              <Text className="font-bold">5</Text>
              <Text className="font-bold">5</Text>
              <Text className="font-bold">5</Text>
            </View>
            <View>
              <Text>{'>>>'}</Text>
              <Text>{'>>>'}</Text>
              <Text>{'>>>'}</Text>
            </View>
            <View className="justify-center items-center">
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItem.power > 5, // TODO: Compare to player current item attributes
                  'text-red-500': selectedItem.power < 5,
                })}
              >
                {selectedItem.power}
              </Text>
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItem.speed > 5,
                  'text-red-500': selectedItem.speed < 5,
                })}
              >
                {selectedItem.speed}
              </Text>
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItem.health > 5,
                  'text-red-500': selectedItem.health < 5,
                })}
              >
                {selectedItem.health}
              </Text>
            </View>
          </View>
          <View className="justify-center items-center">
            <Text className="text-base text-gold font-bold">
              - {selectedItem.cost} Gold
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View>
        <View className="justify-center items-center h-24 my-5">
          <Text>Item Sprite Here</Text>
        </View>
        <Text className="mb-5">{selectedItem.description}</Text>
        <View className="justify-center items-center">
          <Text className="text-base text-gold font-bold">
            - {selectedItem.cost} Gold
          </Text>
        </View>
      </View>
    );
  }, [selectedItem]);

  return (
    <SafeAreaView className="relative w-full h-full flex-1 justify-center items-center bg-off-white">
      <FQModal
        visible={modalVisible}
        setVisible={setModalVisible}
        title={selectedItem ? 'Equip ' + selectedItem.name : ''}
        subtitle={selectedItem ? itemTypeToString(selectedItem.type) : ''}
        onConfirm={() => {
          if (selectedItem && isItemConsumable(selectedItem)) {
            // Close modal
            console.log('Consumable:', selectedItem);
          } else {
            // Equip item
            console.log('Equipment:', selectedItem);
          }

          setSelectedItem(null);
          setModalVisible(false);
        }}
        cancelText={
          selectedItem
            ? isItemConsumable(selectedItem)
              ? undefined
              : 'CANCEL'
            : undefined
        }
        confirmText={
          selectedItem && isItemConsumable(selectedItem) ? 'BACK' : 'BUY ITEM'
        }
      >
        {modalChildren}
      </FQModal>

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
            renderItem={({ item }) => (
              <ItemCard
                item={item}
                onPress={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
              />
            )}
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
            renderItem={({ item }) => (
              <ItemCard
                item={item}
                onPress={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
              />
            )}
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
            renderItem={({ item }) => (
              <ItemCard
                item={item}
                onPress={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
              />
            )}
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
              renderItem={({ item }) => (
                <ItemCard
                  item={item}
                  onPress={() => {
                    setSelectedItem(item);
                    setModalVisible(true);
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View className="w-3" />}
              className="grow-0 m-0"
              horizontal
            />
            <FlatList
              data={filterItemsByTypeAndSortByCost(
                MOCK_ITEMS,
                ItemType.POTION_MEDIUM,
              )}
              renderItem={({ item }) => (
                <ItemCard
                  item={item}
                  onPress={() => {
                    setSelectedItem(item);
                    setModalVisible(true);
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View className="w-3" />}
              className="grow-0 m-0"
              horizontal
            />
            <FlatList
              data={filterItemsByTypeAndSortByCost(
                MOCK_ITEMS,
                ItemType.POTION_LARGE,
              )}
              renderItem={({ item }) => (
                <ItemCard
                  item={item}
                  onPress={() => {
                    setSelectedItem(item);
                    setModalVisible(true);
                  }}
                />
              )}
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

const ItemCard: React.FC<{ item: Item; onPress: () => void }> = ({
  item,
  onPress,
}) => {
  return (
    <View className="flex-col justify-center items-center">
      <TouchableOpacity
        onPress={onPress}
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
      ></TouchableOpacity>
      <Text className="text-lg text-gold mb-5 font-semibold">
        {item.cost} Gold
      </Text>
    </View>
  );
};
