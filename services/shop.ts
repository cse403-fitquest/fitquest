import {
  doc,
  getDoc,
  updateDoc,
  collection,
  arrayUnion,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebaseConfig';
import { User } from '@/types/auth';
import { Item } from '@/types/item';
import { APIResponse } from '@/types/general';

const userConverter = {
  toFirestore: (data: User) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as User,
};

const itemConverter = {
  toFirestore: (data: Item) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Item,
};

// Function to handle the purchase of an item
/**
 * Purchase an item for the user.
 * @param {string} userID - The user's unique ID.
 * @param {string} itemID - The item ID to purchase.
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
const purchaseItem: (
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
    await updateDoc(userRef, { gold: newBalance });

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

    // Add item document ID to user's inventory
    await updateDoc(userRef, {
      [itemInvType]: arrayUnion(itemID),
    });

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
      error: 'Error purchasing item.',
    };
  }
};

export default purchaseItem;
