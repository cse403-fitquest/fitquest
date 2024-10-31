import {
  doc,
  getDoc,
  updateDoc,
  collection,
  arrayUnion,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Function to handle the purchase of an item
/**
 * Purchase an item for the user.
 * @param {string} userDocID - The user's unique ID.
 * @param {string} itemDocID - The item ID to purchase.
 * @returns {Promise<void>}
 */
const purchaseItem = async (userDocID, itemDocID) => {
  try {
    // Get item data
    const itemRef = doc(db, `items`, itemDocID);
    const itemSnap = await getDoc(itemRef);
    const itemData = itemSnap.data();

    // Get user data
    const userRef = doc(db, 'users', userDocID);
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
    const inventoryRef = collection(db, `users/${userDocID}/${itemInvType}`);

    // Add item document ID to proper inventory
    await updateDoc(inventoryRef, {
      [itemInvType]: arrayUnion(itemDocID),
    });

    console.log('Purchase successful! Item added to inventory.');
  } catch (error) {
    console.error('Error purchasing item:', error);
  }
};

export default purchaseItem;
