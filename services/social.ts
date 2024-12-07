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
  AcceptFriendRequestResponse,
  Friend,
  FriendRequest,
  GetUserByEmailResponse,
  GetUserByUsernameResponse,
  GetUserFriendsResponse,
  SendFriendRequestResponse,
  UserFriend,
  UserFriendInDB,
} from '@/types/social';
import { userConverter } from './user';
import { getQuestByID } from './quest';

export const userFriendConverter = {
  toFirestore: (data: UserFriendInDB) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as UserFriendInDB,
};

export const resetAllUserFriendsInDB: () => Promise<APIResponse> = async () => {
  try {
    const userFriendCollection = collection(
      FIREBASE_DB,
      'friends',
    ).withConverter(userFriendConverter);

    const userFriendSnapshots = await getDocs(userFriendCollection);

    userFriendSnapshots.forEach(async (userFriendSnap) => {
      const userFriendData = userFriendSnap.data();

      if (!userFriendData) {
        return;
      }

      await setDoc(doc(userFriendCollection, userFriendData.id), {
        id: userFriendData.id,
        friends: [],
        sentRequests: [],
        pendingRequests: [],
      });
    });

    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error resetting all user friends: ', error);

    return {
      data: null,
      success: false,
      error: 'Error resetting all user friends.',
    };
  }
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
    // Get user friend collection reference
    const userFriendCollection = collection(
      FIREBASE_DB,
      'friends',
    ).withConverter(userFriendConverter);

    // Get user friend reference
    const userFriendRef = doc(userFriendCollection, userID);

    // Get user data
    const userFriendSnap = await getDoc(userFriendRef);
    const userFriendDataInDB = userFriendSnap.data();

    if (!userFriendDataInDB) {
      throw new Error('User friend data not found.');
    }

    // For each friend and request, get their data
    const userFriendsIDs = userFriendDataInDB.friends;
    const userSentRequestsIDs = userFriendDataInDB.sentRequests;
    const userPendingRequestsIDs = userFriendDataInDB.pendingRequests;

    // Get user collection reference
    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    console.log('Attempt to get user friends data');

    // Get friends data
    const friendsData: (Friend | null)[] = await Promise.all(
      userFriendsIDs.map(async (friendID) => {
        const friendSnap = await getDoc(doc(userCollection, friendID));

        if (!friendSnap.exists()) {
          return null;
        }

        const friendData = friendSnap.data();

        console.log('Friend ID: ', friendID);
        const workoutHistory = friendData.workoutHistory || [];
        let lastWorkoutDate = null;
        if (workoutHistory.length > 0) {
          lastWorkoutDate = workoutHistory[0].startedAt;
        }

        // Get user's current quest by quest ID
        let friendCurrentQuest = null;
        if (friendData.currentQuest.id) {
          friendCurrentQuest = await getQuestByID(friendData.currentQuest.id);
        }

        return {
          id: friendID,
          privacySettings: friendData.privacySettings,
          profileInfo: friendData.profileInfo,
          spriteID: friendData.spriteID,
          lastWorkoutDate: lastWorkoutDate,
          currentQuestName: friendCurrentQuest?.questName || null,
        };
      }),
    );

    // console.log('Friends data: ', friendsData);

    // Get sent requests data
    const sentRequestsData: (FriendRequest | null)[] = await Promise.all(
      userSentRequestsIDs.map(async (id) => {
        const requestSnap = await getDoc(doc(userCollection, id));

        if (!requestSnap.exists()) {
          return null;
        }

        return {
          id: id,
          username: requestSnap.data()?.profileInfo.username,
          email: requestSnap.data()?.profileInfo.email,
        };
      }),
    );

    // Get pending requests data
    const pendingRequestsData: (FriendRequest | null)[] = await Promise.all(
      userPendingRequestsIDs.map(async (id) => {
        const requestSnap = await getDoc(doc(userCollection, id));

        if (!requestSnap.exists()) {
          return null;
        }

        return {
          id: id,
          username: requestSnap.data()?.profileInfo.username,
          email: requestSnap.data()?.profileInfo.email,
        };
      }),
    );

    const userFriendData: UserFriend = {
      id: userID,
      friends: [],
      sentRequests: [],
      pendingRequests: [],
    };

    userFriendData.friends = friendsData.filter((friend) => friend !== null);
    userFriendData.sentRequests = sentRequestsData.filter(
      (request) => request !== null,
    );
    userFriendData.pendingRequests = pendingRequestsData.filter(
      (request) => request !== null,
    );

    return {
      success: true,
      error: null,
      data: userFriendData,
    };
  } catch (error) {
    console.error('Error getting user friends: ', error);

    return {
      success: false,
      error: error ? error + '' : 'Error getting user friends.',
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
    const newUserFriends: UserFriendInDB = {
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

// Function to handle cancelling sent friend requests
/**
 * Purchase an item for the user.
 * @param {string} senderID - The ID of the user that sent the friend request.
 * @param {string} receiverID - The ID of the user receiving the friend request.
 * @returns {Promise<APIResponse>} Returns an APIResponse object.
 */
export const cancelFriendRequest: (
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

    // Get sender reference
    const senderUserFriendsRef = doc(userFriendCollection, senderID);

    // Get receiver data by ID
    const getUserByIDResponse = await getDoc(doc(userCollection, receiverID));

    if (!getUserByIDResponse.exists()) {
      return {
        data: null,
        success: false,
        error: 'Receiver not found.',
      };
    }

    const receiverUserData = getUserByIDResponse.data();

    if (!receiverUserData) {
      return {
        data: null,
        success: false,
        error: 'Receiver not found.',
      };
    }

    console.log('User using ID found');

    if (receiverUserData.id === senderID) {
      return {
        data: null,
        success: false,
        error: 'You cannot send a friend request to yourself.',
      };
    }

    // Get receiver reference
    const receiverUserFriendsRef = doc(
      userFriendCollection,
      receiverUserData.id,
    );

    // Check if both users exist
    const senderUserFriendsSnap = await getDoc(senderUserFriendsRef);

    if (!senderUserFriendsSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    const receiverUserFriendSnap = await getDoc(receiverUserFriendsRef);

    if (!receiverUserFriendSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }

    // Check if the users are already friends or already have a pending request from the sender
    const senderUserFriendsData = senderUserFriendsSnap.data();
    const receiverUserFriendsData = receiverUserFriendSnap.data();

    if (
      senderUserFriendsData &&
      receiverUserFriendsData &&
      senderUserFriendsData.friends.some(
        (friendID) => friendID === receiverID,
      ) &&
      receiverUserFriendsData.friends.some((friendID) => friendID === senderID)
    ) {
      return {
        data: null,
        success: false,
        error: 'Users are already friends.',
      };
    }

    console.log('Users are not friends yet');

    // Remove sender from receiver's pending requests and add to friends
    const receiverNewPendingRequests =
      receiverUserFriendsData.pendingRequests.filter(
        (friendID) => friendID !== senderID,
      );

    await updateDoc(receiverUserFriendsRef, {
      pendingRequests: receiverNewPendingRequests,
    });

    // Remove receiver from sender's sent requests and add to friends
    await updateDoc(senderUserFriendsRef, {
      sentRequests: arrayRemove(receiverUserData.id),
    });

    console.log('Sent friend request cancelled!');

    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error cancelling sent friend request: ', error);
    return {
      data: null,
      success: false,
      error: error ? error + '' : 'Error cancelling sent friend request.',
    };
  }
};

// Function to handle accepting friend requests
/**
 * Purchase an item for the user.
 * @param {string} senderID - The user that sent the friend request.
 * @param {string} receiverID - Email address of the receiver.
 * @returns {Promise<AcceptFriendRequestResponse>} Returns an AcceptFriendRequestResponse object.
 */
export const acceptFriendRequest: (
  senderID: string,
  receiverID: string,
) => Promise<AcceptFriendRequestResponse> = async (senderID, receiverID) => {
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
        (friendID) => friendID === receiverID,
      ) &&
      receiverUserFriendsData.friends.some((friendID) => friendID === senderID)
    ) {
      return {
        data: null,
        success: false,
        error: 'Users are already friends.',
      };
    }

    // Remove sender from receiver's pending requests and add to friends
    const receiverNewPendingRequests =
      receiverUserFriendsData.pendingRequests.filter(
        (friendID) => friendID !== senderID,
      );

    await updateDoc(receiverUserFriendsRef, {
      pendingRequests: receiverNewPendingRequests,
      friends: arrayUnion(senderUserData.id),
    });

    // Remove receiver from sender's sent requests and add to friends
    await updateDoc(senderUserFriendsRef, {
      sentRequests: arrayRemove(receiverUserData.id),
      friends: arrayUnion(receiverUserData.id),
    });

    console.log('Friend request accepted!');

    // Return the sender's data for the receiver client to update their friends list
    const senderWorkoutHistory = senderUserData.workoutHistory;
    let senderLastWorkoutDate = null;
    if (senderWorkoutHistory.length > 0) {
      senderLastWorkoutDate =
        senderWorkoutHistory[senderWorkoutHistory.length - 1].startedAt;
    }

    let senderCurrentQuest = null;
    if (senderUserData.currentQuest.id) {
      senderCurrentQuest = await getQuestByID(senderUserData.currentQuest.id);
    }

    const newFriend: Friend = {
      id: senderID,
      privacySettings: senderUserData.privacySettings,
      profileInfo: {
        username: senderUserData.profileInfo.username,
        email: senderUserData.profileInfo.email,
      },
      spriteID: senderUserData.spriteID,
      lastWorkoutDate: senderLastWorkoutDate,
      currentQuestName: senderCurrentQuest?.questName || null,
    };

    return {
      data: newFriend,
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

// Function to handle sending friend requests
/**
 * Purchase an item for the user.
 * @param {string} senderID - The user that sent the friend request.
 * @param {string} receiverUsername - The user receiving the friend request.
 * @returns {Promise<SendFriendRequestResponse>} Returns an SendFriendRequestResponse object.
 */
export const sendFriendRequest: (
  senderID: string,
  receiverUsername: string,
) => Promise<SendFriendRequestResponse> = async (
  senderID,
  receiverUsername,
) => {
  try {
    const userFriendCollection = collection(
      FIREBASE_DB,
      'friends',
    ).withConverter(userFriendConverter);

    const userCollection = collection(FIREBASE_DB, 'users').withConverter(
      userConverter,
    );

    // Get sender reference
    const senderUserFriendsRef = doc(userFriendCollection, senderID);

    // Get receiver data
    const getUserByUsernameResponse = await getUserByUsername(receiverUsername);

    if (!getUserByUsernameResponse.success || !getUserByUsernameResponse.data) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }
    console.log(
      'User using username found!',
      getUserByUsernameResponse.data.id,
    );

    const receiverUserData = getUserByUsernameResponse.data;

    if (receiverUserData.id === senderID) {
      return {
        data: null,
        success: false,
        error: 'You cannot send a friend request to yourself.',
      };
    }

    // Check if both users exist
    const senderUserFriendsSnap = await getDoc(senderUserFriendsRef);

    if (!senderUserFriendsSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    const receiverUserFriendsRef = doc(
      userFriendCollection,
      receiverUserData.id,
    );

    const receiverUserFriendSnap = await getDoc(receiverUserFriendsRef);

    if (!receiverUserFriendSnap.exists()) {
      return {
        data: null,
        success: false,
        error: 'User not found.',
      };
    }

    // Check if the users are already friends
    const senderUserFriends = senderUserFriendsSnap.data();
    const receiverUserFriendsData = receiverUserFriendSnap.data();

    if (
      senderUserFriends &&
      receiverUserFriendsData &&
      senderUserFriends.friends.some(
        (friendID) => friendID === receiverUserData.id,
      ) &&
      receiverUserFriendsData.friends.some((friendID) => friendID === senderID)
    ) {
      return {
        data: null,
        success: false,
        error: 'Users are already friends.',
      };
    }

    console.log('Users are not friends yet');

    // Get sender user data
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
      senderUserFriends.sentRequests.includes(receiverUserData.id) ||
      senderUserFriends.pendingRequests.some(
        (friendID) => friendID === receiverUserData.id,
      ) ||
      receiverUserFriendsData.pendingRequests.some(
        (friendID) => friendID === senderID,
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

    // Add receiver to sender's sent friend requests
    await updateDoc(senderUserFriendsRef, {
      sentRequests: arrayUnion(receiverUserData.id),
    });

    console.log('User email added to sent requests');

    if (!senderUserData) {
      return {
        data: null,
        success: false,
        error: 'Your account is not found. Contact an administrator for help.',
      };
    }

    // Add sender to receiver's pending friend requests
    await updateDoc(receiverUserFriendsRef, {
      pendingRequests: arrayUnion(senderID),
    });

    console.log(
      receiverUserData.profileInfo.username +
        "'s ID added to sender's pending requests and" +
        senderUserData.profileInfo.username +
        "'s ID added to receiver's pending requests",
    );

    console.log("Current user added to receiver'spending requests");

    return {
      data: {
        id: receiverUserData.id,
        username: receiverUserData.profileInfo.username,
        email: receiverUserData.profileInfo.email,
      },
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error sending friend request: ', error);

    return {
      data: null,
      success: false,
      error: error ? error + '' : 'Error sending friend request.',
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
        (friendID) => friendID === receiverID,
      ) &&
      receiverUserFriendsData.friends.some((friendID) => friendID === senderID)
    ) {
      return {
        data: null,
        success: false,
        error: 'Users are already friends.',
      };
    }

    // Remove sender from receiver's pending requests
    const receiverNewPendingRequests =
      receiverUserFriendsData.pendingRequests.filter(
        (friendID) => friendID !== senderID,
      );

    await updateDoc(receiverUserFriendsRef, {
      pendingRequests: receiverNewPendingRequests,
    });

    // Remove receiver from sender's sent requests
    await updateDoc(senderUserFriendsRef, {
      sentRequests: arrayRemove(receiverUserData.id),
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

/**
 * Function to handle removing friends.
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
      (friendID) => friendID !== user2ID,
    );
    await updateDoc(user1UserFriendsRef, {
      friends: user1NewFriends,
    });

    // Remove user1 from user2's friend's list
    const user2NewFriends = user2UserFriendsData.friends.filter(
      (friendID) => friendID !== user1ID,
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

export const getUserByEmail: (
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

export const getUserByUsername: (
  username: string,
) => Promise<GetUserByUsernameResponse> = async (username) => {
  const userRef = collection(FIREBASE_DB, 'users').withConverter(userConverter);
  const q = query(userRef, where('profileInfo.username', '==', username));
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
