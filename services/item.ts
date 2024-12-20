import {
  doc,
  getDoc,
  updateDoc,
  collection,
  arrayUnion,
  QueryDocumentSnapshot,
  getDocs,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebaseConfig';
import { Item } from '@/types/item';
import { APIResponse } from '@/types/general';
import { userConverter } from './user.helper';
import { GetItemsResponse } from '@/types/item';

// Firestore item converter
export const itemConverter = {
  toFirestore: (data: Item) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Item,
};

/**
 * Get all items.
 * @returns {Promise<GetItemsResponse>} Returns an GetItemsResponse object.
 */
export const fetchItems: () => Promise<GetItemsResponse> = async () => {
  try {
    const itemCollection = collection(FIREBASE_DB, 'items').withConverter(
      itemConverter,
    );

    const itemSnapshot = await getDocs(itemCollection);
    const items: Item[] = itemSnapshot.docs.map((doc) => doc.data());

    return {
      data: items,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error getting items:', error);

    return {
      data: [],
      success: false,
      error: 'Error getting items.',
    };
  }
};

/**
 * Set items in DB. This will clear existing items and set new items.
 * @param items - The items to set.
 * @param {Item[]} items - The items to set.
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
export const setItemsInDB: (items: Item[]) => Promise<APIResponse> = async (
  items,
) => {
  try {
    const itemCollection = collection(FIREBASE_DB, 'items').withConverter(
      itemConverter,
    );

    // Clear existing items
    const itemSnapshot = await getDocs(itemCollection);
    itemSnapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // Add new items
    const batch = writeBatch(FIREBASE_DB);
    items.forEach(async (item) => {
      const itemRef = doc(itemCollection, item.id);
      batch.set(itemRef, item);
    });

    await batch.commit();

    console.log('Items set successfully!');

    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error setting items:', error);

    return {
      data: null,
      success: false,
      error: 'Error setting items.',
    };
  }
};

// Function to handle the purchase of an item
/**
 * Purchase an item for the user.
 * @param {string} userID - The user's unique ID.
 * @param {string} itemID - The item ID to purchase.
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
export const purchaseItem: (
  userID: string,
  itemID: string,
) => Promise<APIResponse> = async (userID, itemID) => {
  try {
    const itemCollection = collection(FIREBASE_DB, 'items').withConverter(
      itemConverter,
    );
    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    // Get item data
    const itemRef = doc(itemCollection, itemID);
    const itemSnap = await getDoc(itemRef);
    const itemData = itemSnap.data();

    // Get user data
    const userRef = doc(userCollection, userID);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    if (!itemData || !userData) {
      throw new Error('Item or user data not found.');
    }

    // Check if user does not have enough gold for item
    if (userData.gold < itemData.cost) {
      throw new Error('Not enough balance to purchase this item.');
    }

    // Deduct the cost from the user's balance
    const newBalance = userData.gold - itemData.cost;

    // Item type
    const itemType = itemData.type;

    // Correspondoing inventory type, default to equipment
    let itemInvType = 'equipments';

    if (
      itemType === 'POTION_SMALL' ||
      itemType === 'POTION_MEDIUM' ||
      itemType === 'POTION_LARGE'
    ) {
      // Update inventory type to consumables
      itemInvType = 'consumables';
    }

    if (itemInvType === 'equipments') {
      // Add item document ID to user's inventory
      await updateDoc(userRef, {
        equipments: arrayUnion(itemData.id), // Ensure item is unique in equipments inventory
        gold: newBalance,
      });
    } else {
      // Add item to user's inventory
      const newUserConsumables = [...userData.consumables, itemData.id];

      // Add item document ID to user's inventory
      await updateDoc(userRef, {
        consumables: newUserConsumables,
        gold: newBalance,
      });
    }

    console.log('Purchase successful! Item added to inventory.');

    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error purchasing item:', error);

    return {
      data: null,
      success: false,
      error: error ? error + '' : 'Error purchasing item.',
    };
  }
};
