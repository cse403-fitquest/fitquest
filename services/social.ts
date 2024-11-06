import {
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  getDoc,
  QueryDocumentSnapshot,
  collection,
  setDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebaseConfig';
import { APIResponse } from '@/types/general';
import {
  Friend,
  GetUserByEmailResponse,
  GetUserFriendsResponse,
  UserFriend,
} from '@/types/social';
import { userConverter } from './user';

export const userFriendConverter = {
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
    const userFriendCollection = collection(
      FIREBASE_DB,
      'friends',
    ).withConverter(userFriendConverter);

    // Create user friend data
    const newUserFriends: UserFriend = {
      id: userID,
      friends: [],
      sentRequests: [],
      pendingRequests: [],
    };

    await setDoc(doc(userFriendCollection, userID), newUserFriends);

    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Failed to create user friends: ', error);

    return {
      data: null,
      success: false,
      error: 'Failed to create user friends.',
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
    const senderUserFriendsRef = doc(FIREBASE_DB, 'friends', senderID);

    // Get receiver reference
    const toUserRef = doc(FIREBASE_DB, 'friends', receiverID);

    // Remove fromUser from receiver's pending requests and add to friends
    await updateDoc(toUserRef, {
      pendingFriendRequest: arrayRemove(senderID),
      friends: arrayUnion(senderID),
    });

    // Remove receiver from fromUser's sent requests and add to friends
    await updateDoc(senderUserFriendsRef, {
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
 * @param {string} recieverEmail - The user receiving the friend request.
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
export const sendFriendRequest: (
  senderID: string,
  recieverEmail: string,
) => Promise<APIResponse> = async (senderID, recieverEmail) => {
  try {
    const userFriendCollection = collection(
      FIREBASE_DB,
      'friends',
    ).withConverter(userFriendConverter);

    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    // Get fromUser reference
    const senderUserFriendsRef = doc(userFriendCollection, senderID);

    // Get receiver data
    const getUserByEmailResponse = await getUserByEmail(recieverEmail);

    if (!getUserByEmailResponse.success || !getUserByEmailResponse.data) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }
    console.log('User using email found!', getUserByEmailResponse.data.id);

    const receiverUserData = getUserByEmailResponse.data;

    // Get receiver reference
    const toUserRef = doc(userFriendCollection, receiverUserData.id);

    // Check if both users exist
    const senderUserFriendsSnap = await getDoc(senderUserFriendsRef);

    if (!senderUserFriendsSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    const toUserSnap = await getDoc(toUserRef);

    if (!toUserSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }

    // Check if the users are already friends
    const senderUserFriends = senderUserFriendsSnap.data();
    const receiverUserFriendsData = toUserSnap.data();

    if (
      senderUserFriends &&
      receiverUserFriendsData &&
      senderUserFriends.friends.some((friend) => friend.id === recieverEmail) &&
      receiverUserFriendsData.friends.some((friend) => friend.id === senderID)
    ) {
      return {
        data: null,
        success: false,
        error: 'Users are already friends.',
      };
    }

    console.log('Users are not friends yet');

    // Get fromUser user data
    const senderUserRef = await getDoc(doc(userCollection, senderID));
    const senderUserData = senderUserRef.data();

    if (!senderUserData) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    // Check if current user have already sent or received a friend request to/from the receiver
    if (
      senderUserFriends.sentRequests.includes(recieverEmail) ||
      senderUserFriends.pendingRequests.some(
        (friend) => friend.id === receiverUserData.id,
      ) ||
      receiverUserFriendsData.pendingRequests.some(
        (friend) => friend.id === senderID,
      ) ||
      receiverUserFriendsData.sentRequests.includes(
        senderUserData.profileInfo.email,
      )
    ) {
      return {
        data: null,
        success: false,
        error: 'Friend request already sent or received to/from user.',
      };
    }

    // Add receiver to fromUser's sent friend requests
    await updateDoc(senderUserFriendsRef, {
      sentRequests: arrayUnion(recieverEmail),
    });

    console.log('User email added to sent requests');

    if (!senderUserData) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    const fromUserAsFriend: Friend = {
      id: senderUserData.id,
      privacySettings: senderUserData.privacySettings,
      profileInfo: {
        username: senderUserData.profileInfo.username,
        email: senderUserData.profileInfo.email,
      },
      currentQuest: null,
    };

    // Add fromUser from receiver's pending friend requests
    await updateDoc(toUserRef, {
      pendingRequests: arrayUnion(fromUserAsFriend),
    });

    console.log("Current user added to receiver'spending requests");

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
    const senderUserFriendsRef = doc(FIREBASE_DB, `friends`, senderID);

    // Get receiver reference
    const toUserRef = doc(FIREBASE_DB, `friends`, receiverID);

    // Remove receiver from fromUser's sent requests
    await updateDoc(senderUserFriendsRef, {
      sentFriendRequest: arrayRemove(receiverID),
    });

    // Remove fromUser from receiver's pending requests
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
 * @param {string} senderID - Friend of receiver.
 * @param {string} receiverID - The user deleting the friend request.
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
export const deleteFriend: (
  senderID: string,
  receiverID: string,
) => Promise<APIResponse> = async (senderID, receiverID) => {
  try {
    // Get fromUser reference
    const senderUserFriendsRef = doc(FIREBASE_DB, `friends`, senderID);

    // Get receiver reference
    const toUserRef = doc(FIREBASE_DB, `friends`, receiverID);

    // Remove receiver from fromUser's friends
    await updateDoc(senderUserFriendsRef, {
      friends: arrayRemove(receiverID),
    });

    // Remove fromUser from receiver's friends
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

// HELPER SERVICE FUNCTIONS ===============================

const getUserByEmail: (
  email: string,
) => Promise<GetUserByEmailResponse> = async (email) => {
  const userRef = collection(FIREBASE_DB, 'users').withConverter(userConverter);
  const q = query(userRef, where('profileInfo.email', '==', email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return {
      success: false,
      error: 'User not found.',
      data: null,
    };
  }

  return {
    success: true,
    error: null,
    data: querySnapshot.docs[0].data(),
  };
};

// const checkUserExistsByEmail: (email: string) => Promise<void> = async (
//   email,
// ) => {
//   const usersRef = collection(FIREBASE_DB, 'users').withConverter(
//     userConverter,
//   );
//   const q = query(usersRef, where('profileInfo.email', '==', email));
//   const querySnapshot = await getDocs(q);

//   return !querySnapshot.empty; // Returns true if user exists, false if not
// };
