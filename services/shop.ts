import {
  doc,
  getDoc,
  updateDoc,
  collection,
  arrayUnion,
} from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebaseConfig';

// Function to handle the purchase of an item
/**
 * Purchase an item for the user.
 * @param {string} userID - The user's unique ID.
 * @param {string} itemID - The item ID to purchase.
 * @returns {Promise<void>}
 */
const purchaseItem: (userID: string, itemID: string) => Promise<void> = async (
  userID,
  itemID,
) => {
  try {
    // Get item data
    const itemRef = doc(FIREBASE_DB, `items`, itemID);
    const itemSnap = await getDoc(itemRef);
    const itemData = itemSnap.data();

    // Get user data
    const userRef = doc(FIREBASE_DB, 'users', userID);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    // Check if user does not have enough gold for item
    if (userData.gold < itemData.cost) {
      throw new Error('Not enough balance to purchase this item.');
    }

    // Deduct the cost from the user's balance
    const newBalance = userData.gold - itemData.cost;
    await updateDoc(userRef, { gold: newBalance });

    // Item type
    const itemType = itemData.type.spec;

    // Correspondoing inventory type
    const itemInvType = `${itemType}s`;

    // Item type inventory reference
    const inventoryRef = collection(
      FIREBASE_DB,
      `users/${userID}/${itemInvType}`,
    );

    // Add item document ID to proper inventory
    await updateDoc(inventoryRef, {
      [itemInvType]: arrayUnion(itemID),
    });

    console.log('Purchase successful! Item added to inventory.');
  } catch (error) {
    console.error('Error purchasing item:', error);
  }
};

export default purchaseItem;
