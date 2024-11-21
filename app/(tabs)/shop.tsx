import {
  Alert,
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
  getUserHealthPotionsCountFromItems,
  isItemConsumable,
  itemTypeToString,
} from '@/utils/item';
import clsx from 'clsx';
import FQModal from '@/components/FQModal';
import { useUserStore } from '@/store/user';
import { purchaseItem } from '@/services/item';
import { useItemStore } from '@/store/item';
import { BASE_ITEM } from '@/constants/item';
import { Sprite } from '@/components/Sprite';
import { Ionicons } from '@expo/vector-icons';

const Shop = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const { items } = useItemStore();

  const { user, setUser } = useUserStore();

  const userEquipmentsIDs = user?.equipments || [];
  const userConsumablesIDs = user?.consumables || [];

  // Turn user equipments ids into actual items
  const userEquipments = useMemo(() => {
    return userEquipmentsIDs.map((id) => {
      const equipment = items.find((item) => item.id === id);
      if (!equipment) {
        console.error('User equipment not found:', id);
        return { ...BASE_ITEM, id: id, name: 'Unknown Equipment' };
      }
      return equipment;
    });
  }, [user, items]);

  // Turn user consumables ids into actual items
  const userConsumables = useMemo(() => {
    return userConsumablesIDs.map((id) => {
      const consumable = items.find((item) => item.id === id);
      if (!consumable) {
        console.error('User consumable not found:', id);
        return { ...BASE_ITEM, id: id, name: 'Unknown Consumable' };
      }
      return consumable;
    });
  }, [user, items]);

  const [
    userSmallHealthPotCount,
    userMediumHealthPotCount,
    userLargeHealthPotCount,
  ] = useMemo(() => {
    return getUserHealthPotionsCountFromItems(userConsumables);
  }, [user, userConsumables]);

  const handlePurchaseItem = async () => {
    if (!user || !selectedItem) return;

    // Handle clicking back button on owned item
    if (userEquipments.some((i) => i.id === selectedItem.id)) {
      setModalVisible(false);
      setSelectedItem(null);
      return;
    }

    if (user.gold < selectedItem.cost) {
      Alert.alert(
        'Not enough gold',
        `You need ${selectedItem.cost - user.gold} more gold to buy this.`,
      );
      return;
    }

    if (selectedItem && isItemConsumable(selectedItem)) {
      // Close modal
      console.log('Consumable:', selectedItem);

      // Update user data
      const oldUser = user;

      setUser({
        ...user,
        gold: user.gold - selectedItem.cost,
        consumables: [...userConsumablesIDs, selectedItem.id],
      });

      setModalVisible(false);
      setSelectedItem(null);

      const purchaseItemResponse = await purchaseItem(user.id, selectedItem.id);

      if (!purchaseItemResponse.success) {
        Alert.alert(
          'Error',
          purchaseItemResponse.error ?? 'Error purchasing equipment',
        );

        // Rollback user data
        setUser(oldUser);
        return;
      }
    } else {
      // Buy and equip item
      console.log('Equipment:', selectedItem);

      // Update user data
      const oldUser = user;

      setUser({
        ...user,
        gold: user.gold - selectedItem.cost,
        equipments: [...userEquipmentsIDs, selectedItem.id],
      });

      setModalVisible(false);
      setSelectedItem(null);

      const purchaseItemResponse = await purchaseItem(user.id, selectedItem.id);

      if (!purchaseItemResponse.success) {
        Alert.alert(
          'Error',
          purchaseItemResponse.error ?? 'Error purchasing consumable',
        );

        // Rollback user data
        setUser(oldUser);
        return;
      }
    }
  };

  const modalChildren = useMemo(() => {
    if (!user || !selectedItem) return null;

    const owned = userEquipments.some((i) => i.id === selectedItem.id);

    if (
      [ItemType.WEAPON, ItemType.ARMOR, ItemType.ACCESSORY].includes(
        selectedItem.type,
      )
    ) {
      // Compare selected item with user's current equipment
      const userEquippedItem = userEquipments.find(
        (i) => i.type === selectedItem.type,
      ) || {
        ...BASE_ITEM,
        power: 0,
        speed: 0,
        health: 0,
      };

      const powerDiff = selectedItem.power - userEquippedItem.power;
      const speedDiff = selectedItem.speed - userEquippedItem.speed;
      const healthDiff = selectedItem.health - userEquippedItem.health;

      return (
        <View>
          <View className="justify-center items-center h-[120px] mt-3 mb-5">
            <Sprite id={selectedItem.spriteID} width={120} height={120} />
          </View>
          <Text className="mb-5">{selectedItem.description}</Text>
          <View className="flex-row justify-evenly items-center mb-5">
            <View>
              <Text className="font-medium">Power:</Text>
              <Text className="font-medium">Speed:</Text>
              <Text className="font-medium">Health:</Text>
            </View>
            <View className="justify-center items-center">
              <Text className="font-bold">{userEquippedItem.power}</Text>
              <Text className="font-bold">{userEquippedItem.speed}</Text>
              <Text className="font-bold">{userEquippedItem.health}</Text>
            </View>
            <View>
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color="black"
              />
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color="black"
              />
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color="black"
              />
            </View>
            <View className="justify-center items-center">
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItem.power > userEquippedItem.power,
                  'text-red-500': selectedItem.power < userEquippedItem.power,
                })}
              >
                {selectedItem.power}
              </Text>
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItem.speed > userEquippedItem.speed,
                  'text-red-500': selectedItem.speed < userEquippedItem.speed,
                })}
              >
                {selectedItem.speed}
              </Text>
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItem.health > userEquippedItem.health,
                  'text-red-500': selectedItem.health < userEquippedItem.health,
                })}
              >
                {selectedItem.health}
              </Text>
            </View>
            <View className="justify-center items-start">
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItem.power > userEquippedItem.power,
                  'text-red-500': selectedItem.power < userEquippedItem.power,
                })}
              >
                {powerDiff == 0
                  ? null
                  : powerDiff > 0
                    ? `+${powerDiff}`
                    : powerDiff}
              </Text>
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItem.speed > userEquippedItem.speed,
                  'text-red-500': selectedItem.speed < userEquippedItem.speed,
                })}
              >
                {speedDiff == 0
                  ? null
                  : speedDiff > 0
                    ? `+${speedDiff}`
                    : speedDiff}
              </Text>
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItem.health > userEquippedItem.health,
                  'text-red-500': selectedItem.health < userEquippedItem.health,
                })}
              >
                {healthDiff == 0
                  ? null
                  : healthDiff > 0
                    ? `+${healthDiff}`
                    : healthDiff}
              </Text>
            </View>
          </View>
          <View className="justify-center items-center">
            {owned ? (
              <Text className="text-base text-black font-bold">
                You already own this item
              </Text>
            ) : (
              <Text className="text-base text-gold font-bold">
                {selectedItem.cost} Gold to purchase
              </Text>
            )}
          </View>
        </View>
      );
    }

    // Only non-equipment items left are consumables

    let healthPotionsCount = 0;

    if (selectedItem.type === ItemType.POTION_SMALL) {
      healthPotionsCount = userSmallHealthPotCount;
    } else if (selectedItem.type === ItemType.POTION_MEDIUM) {
      healthPotionsCount = userMediumHealthPotCount;
    } else if (selectedItem.type === ItemType.POTION_LARGE) {
      healthPotionsCount = userLargeHealthPotCount;
    }

    return (
      <View>
        <View className="justify-center items-center h-24 my-5">
          <View className="justify-center items-center h-[120px] mt-3 mb-5">
            <Sprite id={selectedItem.spriteID} width={120} height={120} />
          </View>
        </View>
        <Text className="mb-2">{selectedItem.description}</Text>
        <Text className="mb-5">
          You currently own{' '}
          <Text className="font-bold">{healthPotionsCount}</Text> of this
          consumable.
        </Text>
        <View className="justify-center items-center">
          <Text className="text-base text-gold font-bold">
            {selectedItem.cost} Gold to purchase
          </Text>
        </View>
      </View>
    );
  }, [selectedItem, user]);

  return (
    <SafeAreaView className="relative w-full h-full flex-1 justify-center items-center bg-off-white">
      <FQModal
        visible={modalVisible}
        setVisible={setModalVisible}
        title={selectedItem ? 'Equip ' + selectedItem.name : ''}
        subtitle={selectedItem ? itemTypeToString(selectedItem.type) : ''}
        onConfirm={handlePurchaseItem}
        cancelText={
          selectedItem && userEquipments.some((i) => i.id === selectedItem.id)
            ? undefined
            : 'CANCEL'
        }
        confirmText={
          selectedItem && userEquipments.some((i) => i.id === selectedItem.id)
            ? 'BACK'
            : 'BUY ITEM'
        }
      >
        {modalChildren}
      </FQModal>

      <ScrollView className="w-full h-full px-6 py-8">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl text-gray-black mb-5">Shop</Text>
          <Text className="text-lg text-gold mb-5 font-semibold">
            {user?.gold ?? 0} Gold
          </Text>
        </View>

        <View className="w-full  mb-5">
          <Text className="text-xl text-grayDark font-bold mb-2">WEAPONS</Text>
          <FlatList
            data={filterItemsByTypeAndSortByCost(items, ItemType.WEAPON)}
            renderItem={({ item }) => (
              <ItemCard
                item={item}
                onPress={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
                owned={userEquipments.some((i) => i.id === item.id)}
              />
            )}
            ItemSeparatorComponent={() => <View className="w-3" />}
            className="grow-0 m-0"
            keyExtractor={(item) => item.id}
            horizontal
          />
        </View>

        <View className="w-full  mb-5">
          <Text className="text-xl text-grayDark font-bold mb-2">ARMORS</Text>
          <FlatList
            data={filterItemsByTypeAndSortByCost(items, ItemType.ARMOR)}
            renderItem={({ item }) => (
              <ItemCard
                item={item}
                onPress={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
                owned={userEquipments.some((i) => i.id === item.id)}
              />
            )}
            ItemSeparatorComponent={() => <View className="w-3" />}
            className="grow-0 m-0"
            horizontal
          />
        </View>

        <View className="w-full  mb-5">
          <Text className="text-xl text-grayDark font-bold mb-2">
            ACCESSORIES
          </Text>
          <FlatList
            data={filterItemsByTypeAndSortByCost(items, ItemType.ACCESSORY)}
            renderItem={({ item }) => (
              <ItemCard
                item={item}
                onPress={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
                owned={userEquipments.some((i) => i.id === item.id)}
              />
            )}
            ItemSeparatorComponent={() => <View className="w-3" />}
            className="grow-0 m-0"
            horizontal
          />
        </View>

        <View className="w-full  mb-5">
          <Text className="text-xl text-grayDark font-bold mb-2">POTIONS</Text>
          <View className="flex-row gap-3">
            <FlatList
              data={filterItemsByTypeAndSortByCost(
                items,
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
                items,
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
                items,
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

const ItemCard: React.FC<{
  item: Item;
  onPress: () => void;
  owned?: boolean;
}> = ({ item, onPress, owned = false }) => {
  return (
    <View className="flex-col justify-center items-center">
      <TouchableOpacity
        onPress={onPress}
        className={clsx(
          'relative rounded w-24 h-24 border border-gray bg-white shadow-lg shadow-black mb-2 justify-center items-center',
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
      >
        <Sprite id={item.spriteID} width={70} height={70} />
        {owned && <Text className="absolute font-black z-10">OWNED</Text>}
        {owned && (
          <View className="absolute bg-white opacity-50 w-full h-full" />
        )}
      </TouchableOpacity>
      <Text className="text-lg text-gold mb-5 font-semibold">
        {item.cost} Gold
      </Text>
    </View>
  );
};
