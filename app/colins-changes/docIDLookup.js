import { db } from './firebaseConfig';

// Function to handle the purchase of an item
/**
 * Purchase an item for the user.
 * Example: "users, profileInfo.email, email"
 * @param {string} schema - Target schema
 * @param {string} db_field - Document field to check
 * @param {string} data - Known data for the field
 * @returns {Promise<void>}
 */
export const id_lookup = async (schema, db_field, data) => {
  try {
    // Get users db reference
    const usersCollection = db.collection(schema);

    // Query for documents where "userid" field is equal to the specified userId
    const querySnapshot = await usersCollection
      .where(db_field, '==', data)
      .get();

    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      data: doc.data(),
    };
  } catch (error) {
    console.error('Error fetching documents: ', error);
    throw error;
  }
};
