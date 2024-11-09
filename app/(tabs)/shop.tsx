import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Item, ItemType } from '@/types/item';
import {
  filterItemsByTypeAndSortByCost,
  getHealthPotionsCountFromItems,
  isItemConsumable,
  itemTypeToString,
} from '@/utils/item';
import clsx from 'clsx';
import FQModal from '@/components/FQModal';
import { useUserStore } from '@/store/user';
import purchaseItem, { getShopItems, setShopItemsInDB } from '@/services/shop';
import { MOCK_SHOP_ITEMS } from '@/constants/shop';

const Shop = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const [shopItems, setShopItems] = useState<Item[]>([]);

  const { user, setUser } = useUserStore();

  const userEquipments = user?.equipments || [];
  const userConsumables = user?.consumables || [];

  const [
    userSmallHealthPotCount,
    userMediumHealthPotCount,
    userLargeHealthPotCount,
  ] = useMemo(() => {
    return getHealthPotionsCountFromItems(userConsumables);
  }, [user, userConsumables]);

  useEffect(() => {
    const getShopItemsData = async () => {
      const getShopItemsResponse = await getShopItems();

      if (getShopItemsResponse.success) {
        setShopItems(getShopItemsResponse.data);
      } else {
        if (getShopItemsResponse.error)
          Alert.alert('Error', getShopItemsResponse.error);
      }
    };

    // Set shop items in DB (for testing)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _setShopItemsData = async () => {
      const setShopItemsResponse = await setShopItemsInDB(MOCK_SHOP_ITEMS);

      if (!setShopItemsResponse.success) {
        if (setShopItemsResponse.error)
          Alert.alert('Error', setShopItemsResponse.error);
      } else {
        getShopItemsData();
      }
    };

    // void _setShopItemsData();
    void getShopItemsData();
  }, []);

  const handlePurchaseItem = async () => {
    if (!user || !selectedItem) return;

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
        consumables: [...userConsumables, selectedItem],
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
        equipments: [...userEquipments, selectedItem],
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
              <Text className="font-bold">{user.attributes.power}</Text>
              <Text className="font-bold">{user.attributes.speed}</Text>
              <Text className="font-bold">{user.attributes.health}</Text>
            </View>
            <View>
              <Text>{'>>>'}</Text>
              <Text>{'>>>'}</Text>
              <Text>{'>>>'}</Text>
            </View>
            <View className="justify-center items-center">
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItem.power > user.attributes.power,
                  'text-red-500': selectedItem.power < user.attributes.power,
                })}
              >
                {selectedItem.power}
              </Text>
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItem.speed > user.attributes.speed,
                  'text-red-500': selectedItem.speed < user.attributes.speed,
                })}
              >
                {selectedItem.speed}
              </Text>
              <Text
                className={clsx('font-bold', {
                  'text-green': selectedItem.health > user.attributes.health,
                  'text-red-500': selectedItem.health < user.attributes.health,
                })}
              >
                {selectedItem.health}
              </Text>
            </View>
          </View>
          <View className="justify-center items-center">
            <Text className="text-base text-gold font-bold">
              {selectedItem.cost} Gold to purchase
            </Text>
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
          <Text>Item Sprite Here</Text>
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
        cancelText={'CANCEL'}
        confirmText={'BUY ITEM'}
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
          <Text className="text-xl text-gray-black font-bold mb-2">
            WEAPONS
          </Text>
          <FlatList
            data={filterItemsByTypeAndSortByCost(shopItems, ItemType.WEAPON)}
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
          <Text className="text-xl text-gray-black font-bold mb-2">ARMORS</Text>
          <FlatList
            data={filterItemsByTypeAndSortByCost(shopItems, ItemType.ARMOR)}
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
          <Text className="text-xl text-gray-black font-bold mb-2">
            ACCESSORIES
          </Text>
          <FlatList
            data={filterItemsByTypeAndSortByCost(shopItems, ItemType.ACCESSORY)}
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
          <Text className="text-xl text-gray-black font-bold mb-2">
            POTIONS
          </Text>
          <View className="flex-row gap-3">
            <FlatList
              data={filterItemsByTypeAndSortByCost(
                shopItems,
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
                shopItems,
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
                shopItems,
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
        disabled={owned}
        onPress={onPress}
        className={clsx(
          'rounded w-24 h-24 border border-gray bg-white shadow-lg shadow-black mb-2 justify-center items-center',
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
        {owned && <Text className="font-black z-10">OWNED</Text>}
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
