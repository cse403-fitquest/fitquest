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
 * @param {string} receiverID - Email address of the receiver.
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
export const acceptFriendRequest: (
  senderID: string,
  receiverID: string,
) => Promise<APIResponse> = async (senderID, receiverID) => {
  try {
    const userFriendCollection = collection(
      FIREBASE_DB,
      'friends',
    ).withConverter(userFriendConverter);

    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    // Get sender UserFriend reference
    const senderUserFriendsRef = doc(userFriendCollection, senderID);

    // Get receiver UserFriend reference
    const receiverUserFriendsRef = doc(userFriendCollection, receiverID);

    // Check if both users exist
    const senderUserFriendsSnap = await getDoc(senderUserFriendsRef);

    if (!senderUserFriendsSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }

    const receiverUserFriendsSnap = await getDoc(receiverUserFriendsRef);

    if (!receiverUserFriendsSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    // Get sender and receiver user data
    const senderUserSnap = await getDoc(doc(userCollection, senderID));

    if (!senderUserSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }

    const senderUserData = senderUserSnap.data();

    if (!senderUserData) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }

    const receiverUserSnap = await getDoc(doc(userCollection, receiverID));

    if (!receiverUserSnap) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    const receiverUserData = receiverUserSnap.data();

    if (!receiverUserData) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    const senderAsFriend: Friend = {
      id: senderID,
      privacySettings: senderUserData.privacySettings,
      profileInfo: {
        username: senderUserData.profileInfo.username,
        email: senderUserData.profileInfo.email,
      },
      currentQuest: null,
    };

    const receiverAsFriend: Friend = {
      id: receiverID,
      privacySettings: receiverUserData.privacySettings,
      profileInfo: {
        username: receiverUserData.profileInfo.username,
        email: receiverUserData.profileInfo.email,
      },
      currentQuest: null,
    };

    // Check if the users are already friends
    const senderUserFriendsData = senderUserFriendsSnap.data();
    const receiverUserFriendsData = receiverUserFriendsSnap.data();

    if (
      senderUserFriendsData &&
      receiverUserFriendsData &&
      senderUserFriendsData.friends.some(
        (friend) => friend.id === receiverID,
      ) &&
      receiverUserFriendsData.friends.some((friend) => friend.id === senderID)
    ) {
      return {
        data: null,
        success: false,
        error: 'Users are already friends.',
      };
    }

    // Remove sender from receiver's pending requests and add to friends

    const newPendingRequests = receiverUserFriendsData.pendingRequests.filter(
      (friend) => friend.id !== senderID,
    );

    await updateDoc(receiverUserFriendsRef, {
      pendingRequests: newPendingRequests,
      friends: arrayUnion(senderAsFriend),
    });

    // Remove receiver from sender's sent requests and add to friends
    await updateDoc(senderUserFriendsRef, {
      sentRequests: arrayRemove(receiverUserData.profileInfo.email),
      friends: arrayUnion(receiverAsFriend),
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

    if (receiverUserData.id === senderID) {
      return {
        data: null,
        success: false,
        error: 'You cannot send a friend request to yourself.',
      };
    }

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

// Function to handle denying friend requests
/**
 * Purchase an item for the user.
 * @param {string} senderID - The user that sent the friend request.
 * @param {string} receiverID - The user rejecting the friend request.
 * @returns {Promise<APIResponse>} Returns an object containing the success status and error message
 */
export const denyFriendRequest: (
  senderID: string,
  receiverID: string,
) => Promise<APIResponse> = async (senderID, receiverID) => {
  try {
    const userFriendCollection = collection(
      FIREBASE_DB,
      'friends',
    ).withConverter(userFriendConverter);

    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    // Get sender UserFriend reference
    const senderUserFriendsRef = doc(userFriendCollection, senderID);

    // Get receiver UserFriend reference
    const receiverUserFriendsRef = doc(userFriendCollection, receiverID);

    // Check if both users exist
    const senderUserFriendsSnap = await getDoc(senderUserFriendsRef);

    if (!senderUserFriendsSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }

    const receiverUserFriendsSnap = await getDoc(receiverUserFriendsRef);

    if (!receiverUserFriendsSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    // Get sender and receiver user data
    const senderUserSnap = await getDoc(doc(userCollection, senderID));

    if (!senderUserSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }

    const senderUserData = senderUserSnap.data();

    if (!senderUserData) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }

    const receiverUserSnap = await getDoc(doc(userCollection, receiverID));

    if (!receiverUserSnap) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    const receiverUserData = receiverUserSnap.data();

    if (!receiverUserData) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    // Check if the users are already friends
    const senderUserFriendsData = senderUserFriendsSnap.data();
    const receiverUserFriendsData = receiverUserFriendsSnap.data();

    if (
      senderUserFriendsData &&
      receiverUserFriendsData &&
      senderUserFriendsData.friends.some(
        (friend) => friend.id === receiverID,
      ) &&
      receiverUserFriendsData.friends.some((friend) => friend.id === senderID)
    ) {
      return {
        data: null,
        success: false,
        error: 'Users are already friends.',
      };
    }

    // Remove sender from receiver's pending requests
    const newPendingRequests = receiverUserFriendsData.pendingRequests.filter(
      (friend) => friend.id !== senderID,
    );

    await updateDoc(receiverUserFriendsRef, {
      pendingRequests: newPendingRequests,
    });

    // Remove receiver from sender's sent requests
    await updateDoc(senderUserFriendsRef, {
      sentRequests: arrayRemove(receiverUserData.profileInfo.email),
    });

    console.log('Friend request denied!');

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

// Function to handle removing friends
/**
 * Purchase an item for the user.
 * @param {string} user1ID - Friend of receiver.
 * @param {string} user2ID - The user deleting the friend request.
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
export const removeFriend: (
  user1ID: string,
  user2ID: string,
) => Promise<APIResponse> = async (user1ID, user2ID) => {
  try {
    const userFriendCollection = collection(
      FIREBASE_DB,
      'friends',
    ).withConverter(userFriendConverter);

    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    // Get user1 UserFriend reference
    const user1UserFriendsRef = doc(userFriendCollection, user1ID);

    // Get user2 UserFriend reference
    const user2UserFriendsRef = doc(userFriendCollection, user2ID);

    // Check if both users exist
    const user1UserFriendsSnap = await getDoc(user1UserFriendsRef);

    if (!user1UserFriendsSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }

    const user2UserFriendsSnap = await getDoc(user2UserFriendsRef);

    if (!user2UserFriendsSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    // Get user1 and user2 user data
    const user1UserSnap = await getDoc(doc(userCollection, user1ID));

    if (!user1UserSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }

    const user1UserData = user1UserSnap.data();

    if (!user1UserData) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }

    const user2UserSnap = await getDoc(doc(userCollection, user2ID));

    if (!user2UserSnap) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    const user2UserData = user2UserSnap.data();

    if (!user2UserData) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    const user1UserFriendsData = user1UserFriendsSnap.data();
    const user2UserFriendsData = user2UserFriendsSnap.data();

    // Remove user2 from user1's friend's list
    const user1NewFriends = user1UserFriendsData.friends.filter(
      (friend) => friend.id !== user2ID,
    );
    await updateDoc(user1UserFriendsRef, {
      friends: user1NewFriends,
    });

    // Remove user1 from user2's friend's list
    const user2NewFriends = user2UserFriendsData.friends.filter(
      (friend) => friend.id !== user1ID,
    );
    await updateDoc(user2UserFriendsRef, {
      friends: user2NewFriends,
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
