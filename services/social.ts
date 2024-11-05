import {
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  getDoc,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebaseConfig';
import { APIResponse } from '@/types/general';
import { GetUserFriendsResponse, UserFriend } from '@/types/social';

const userFriendConverter = {
  toFirestore: (data: UserFriend) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as UserFriend,
};

/**
 * Get the user's friends.
 * @param {string} userID The user's unique ID.
 * @returns An object containing the user's friends.
 */
export const getUserFriends: (
  userID: string,
) => Promise<GetUserFriendsResponse> = async (userID) => {
  try {
    // Get user friend reference
    const userFriendRef = doc(FIREBASE_DB, 'friends', userID).withConverter(
      userFriendConverter,
    );

    // Get user data
    const userFriendSnap = await getDoc(userFriendRef);
    const userFriendData = userFriendSnap.data();

    if (!userFriendData) {
      throw new Error('User friend data not found.');
    }

    return {
      success: true,
      error: null,
      data: userFriendData,
    };
  } catch (error) {
    console.error('Error getting user friends: ', error);

    return {
      success: false,
      error: 'Error getting user friends.',
      data: null,
    };
  }
};

export const createUserFriends: (
  userID: string,
) => Promise<APIResponse> = async (userID) => {
  try {
    // Get user friend reference
    const userFriendRef = doc(FIREBASE_DB, 'friends', userID).withConverter(
      userFriendConverter,
    );

    // Create user friend data
    await updateDoc(userFriendRef, {
      id: userID,
      friends: [],
      sentRequests: [],
      pendingRequests: [],
    });

    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error creating user friends: ', error);

    return {
      data: null,
      success: false,
      error: 'Error creating user friends.',
    };
  }
};

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
    const fromUserRef = doc(FIREBASE_DB, 'friends', senderID);

    // Get toUser reference
    const toUserRef = doc(FIREBASE_DB, 'friends', receiverID);

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
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error accepting friend request: ', error);
    return {
      data: null,
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
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error sending friend request: ', error);

    return {
      data: null,
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
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error rejecting friend request: ', error);

    return {
      data: null,
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
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error removing friend: ', error);

    return {
      data: null,
      success: false,
      error: 'Error removing friend.',
    };
  }
};
