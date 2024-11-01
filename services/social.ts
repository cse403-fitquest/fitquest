import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebaseConfig';
import { APIResponse } from '@/types/general';

// Function to handle accepting friend requests
/**
 * Purchase an item for the user.
 * @param {string} senderID - The user that sent the friend request.
 * @param {string} receiverID - The user accepting the friend request.
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
export const acceptFriendRequest: (
  senderID: string,
  receiverID: string,
) => Promise<APIResponse> = async (senderID, receiverID) => {
  try {
    // Get fromUser reference
    const fromUserRef = doc(FIREBASE_DB, `friends`, senderID);

    // Get toUser reference
    const toUserRef = doc(FIREBASE_DB, `friends`, receiverID);

    // Remove fromUser from toUser's pending requests and add to friends
    await updateDoc(toUserRef, {
      pendingFriendRequest: arrayRemove(senderID),
      friends: arrayUnion(senderID),
    });

    // Remove toUser from fromUser's sent requests and add to friends
    await updateDoc(fromUserRef, {
      sentFriendRequest: arrayRemove(receiverID),
      friends: arrayUnion(receiverID),
    });

    console.log('Friend request accepted!');

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error accepting friend request: ', error);
    return {
      success: false,
      error: 'Error accepting friend request.',
    };
  }
};

// Function to handle accepting friend requests
/**
 * Purchase an item for the user.
 * @param {string} senderID - The user that sent the friend request.
 * @param {string} receiverID - The user receiving the friend request.
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
export const sendFriendRequest: (
  senderID: string,
  receiverID: string,
) => Promise<APIResponse> = async (senderID, receiverID) => {
  try {
    // Get fromUser reference
    const fromUserRef = doc(FIREBASE_DB, `friends`, senderID);

    // Get toUser reference
    const toUserRef = doc(FIREBASE_DB, `friends`, receiverID);

    // Add toUser to fromUser's sent friend requests
    await updateDoc(fromUserRef, {
      sentFriendRequest: arrayUnion(receiverID),
    });

    // Add fromUser from toUser's pending friend requests
    await updateDoc(toUserRef, {
      pendingFriendRequest: arrayUnion(senderID),
    });

    console.log('Friend request sent!');

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error sending friend request: ', error);

    return {
      success: false,
      error: 'Error sending friend request.',
    };
  }
};

// Function to handle accepting friend requests
/**
 * Purchase an item for the user.
 * @param {string} senderID - The user that sent the friend request.
 * @param {string} receiverID - The user rejecting the friend request.
 * @returns {Promise<APIResponse>} Returns an object containing the success status and error message
 */
export const rejectFriendRequest: (
  senderID: string,
  receiverID: string,
) => Promise<APIResponse> = async (senderID, receiverID) => {
  try {
    // Get fromUser reference
    const fromUserRef = doc(FIREBASE_DB, `friends`, senderID);

    // Get toUser reference
    const toUserRef = doc(FIREBASE_DB, `friends`, receiverID);

    // Remove toUser from fromUser's sent requests
    await updateDoc(fromUserRef, {
      sentFriendRequest: arrayRemove(receiverID),
    });

    // Remove fromUser from toUser's pending requests
    await updateDoc(toUserRef, {
      pendingFriendRequest: arrayRemove(senderID),
    });

    console.log('Friend request rejected!');

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error rejecting friend request: ', error);

    return {
      success: false,
      error: 'Error rejecting friend request.',
    };
  }
};

// Function to handle accepting friend requests
/**
 * Purchase an item for the user.
 * @param {string} senderID - Friend of toUser.
 * @param {string} receiverID - The user deleting the friend request.
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
export const deleteFriend: (
  senderID: string,
  receiverID: string,
) => Promise<APIResponse> = async (senderID, receiverID) => {
  try {
    // Get fromUser reference
    const fromUserRef = doc(FIREBASE_DB, `friends`, senderID);

    // Get toUser reference
    const toUserRef = doc(FIREBASE_DB, `friends`, receiverID);

    // Remove toUser from fromUser's friends
    await updateDoc(fromUserRef, {
      friends: arrayRemove(receiverID),
    });

    // Remove fromUser from toUser's friends
    await updateDoc(toUserRef, {
      friends: arrayRemove(senderID),
    });

    console.log('Friend removed!');

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error removing friend: ', error);

    return {
      success: false,
      error: 'Error removing friend.',
    };
  }
};
