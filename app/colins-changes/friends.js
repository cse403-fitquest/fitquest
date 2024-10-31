import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Function to handle accepting friend requests
/**
 * Purchase an item for the user.
 * @param {string} fromUserDocID - The user that sent the friend request.
 * @param {string} toUserDocID - The user accepting the friend request.
 * @returns {Promise<void>}
 */
export const acceptFriendRequest = async (fromUserDocID, toUserDocID) => {
  try {
    // Get fromUser reference
    const fromUserRef = doc(db, `friends`, fromUserDocID);

    // Get toUser reference
    const toUserRef = doc(db, `friends`, toUserDocID);

    // Remove fromUser from toUser's pending requests and add to friends
    await updateDoc(toUserRef, {
      pendingFriendRequest: arrayRemove(fromUserDocID),
      friends: arrayUnion(fromUserDocID),
    });

    // Remove toUser from fromUser's sent requests and add to friends
    await updateDoc(fromUserRef, {
      sentFriendRequest: arrayRemove(toUserDocID),
      friends: arrayUnion(toUserDocID),
    });

    console.log('Friend request accepted!');
  } catch (error) {
    console.error('Error accepting friend request: ', error);
  }
};

// Function to handle accepting friend requests
/**
 * Purchase an item for the user.
 * @param {string} fromUserDocID - The user that sent the friend request.
 * @param {string} toUserDocID - The user receiving the friend request.
 * @returns {Promise<void>}
 */
export const sendFriendRequest = async (fromUserDocID, toUserDocID) => {
  try {
    // Get fromUser reference
    const fromUserRef = doc(db, `friends`, fromUserDocID);

    // Get toUser reference
    const toUserRef = doc(db, `friends`, toUserDocID);

    // Add toUser to fromUser's sent friend requests
    await updateDoc(fromUserRef, {
      sentFriendRequest: arrayUnion(toUserDocID),
    });

    // Add fromUser from toUser's pending friend requests
    await updateDoc(toUserRef, {
      pendingFriendRequest: arrayUnion(fromUserDocID),
    });

    console.log('Friend request sent!');
  } catch (error) {
    console.error('Error sending friend request: ', error);
  }
};

// Function to handle accepting friend requests
/**
 * Purchase an item for the user.
 * @param {string} fromUserDocID - The user that sent the friend request.
 * @param {string} toUserDocID - The user rejecting the friend request.
 * @returns {Promise<void>}
 */
export const rejectFriendRequest = async (fromUserDocID, toUserDocID) => {
  try {
    // Get fromUser reference
    const fromUserRef = doc(db, `friends`, fromUserDocID);

    // Get toUser reference
    const toUserRef = doc(db, `friends`, toUserDocID);

    // Remove toUser from fromUser's sent requests
    await updateDoc(fromUserRef, {
      sentFriendRequest: arrayRemove(toUserDocID),
    });

    // Remove fromUser from toUser's pending requests
    await updateDoc(toUserRef, {
      pendingFriendRequest: arrayRemove(fromUserDocID),
    });

    console.log('Friend request rejected!');
  } catch (error) {
    console.error('Error rejecting friend request: ', error);
  }
};

// Function to handle accepting friend requests
/**
 * Purchase an item for the user.
 * @param {string} fromUserDocID - Friend of toUser.
 * @param {string} toUserDocID - The user deleting the friend request.
 * @returns {Promise<void>}
 */
export const deleteFriend = async (fromUserDocID, toUserDocID) => {
  try {
    // Get fromUser reference
    const fromUserRef = doc(db, `friends`, fromUserDocID);

    // Get toUser reference
    const toUserRef = doc(db, `friends`, toUserDocID);

    // Remove toUser from fromUser's friends
    await updateDoc(fromUserRef, {
      friends: arrayRemove(toUserDocID),
    });

    // Remove fromUser from toUser's friends
    await updateDoc(toUserRef, {
      friends: arrayRemove(fromUserDocID),
    });

    console.log('Friend removed!');
  } catch (error) {
    console.error('Error removing friend: ', error);
  }
};
