import { FIREBASE_DB } from '@/firebaseConfig';
import { APIResponse } from '@/types/general';
import { Quest, QuestProgress, QuestResponse } from '@/types/quest';
import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

export const questConverter = {
  toFirestore: (data: Quest) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Quest,
};

/**
 * Get all available quests from Firestore
 */
export const getAvailableQuests = async (): Promise<APIResponse> => {
  try {
    const questCollection = collection(FIREBASE_DB, 'quests').withConverter(
      questConverter,
    );
    const questsSnapshot = await getDocs(questCollection);
    const quests = questsSnapshot.docs.map((doc) => doc.data());

    return {
      success: true,
      data: { quests },
      error: null,
    };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error('Error getting quests:', error.code, error.message);
      return {
        success: false,
        data: null,
        error: 'Error getting quests. Please try again.',
      };
    } else {
      console.error('Error getting quests:', error);
      return {
        success: false,
        data: null,
        error: 'Error getting quests. Please try again.',
      };
    }
  }
};

/**
 * Start a quest for a user
 */
export const startQuest = async (
  userId: string,
  questId: string,
): Promise<QuestResponse> => {
  try {
    const questProgress: QuestProgress = {
      questId,
      progress: 0,
      bossDefeated: false,
      startedAt: Date.now(),
    };

    const userQuestRef = doc(
      FIREBASE_DB,
      'users',
      userId,
      'activeQuest',
      questId,
    );
    await setDoc(userQuestRef, questProgress);

    return {
      success: true,
      data: questProgress,
      error: undefined,
    };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error('Error starting quest:', error.code, error.message);
      return {
        success: false,
        data: null,
        error: 'Error starting quest. Please try again.',
      };
    } else {
      console.error('Error starting quest:', error);
      return {
        success: false,
        data: null,
        error: 'Error starting quest. Please try again.',
      };
    }
  }
};

/**
 * Update quest progress
 */
export const updateQuestProgress = async (
  userId: string,
  questId: string,
  progress: number,
  bossDefeated: boolean = false,
): Promise<QuestResponse> => {
  try {
    const userQuestRef = doc(
      FIREBASE_DB,
      'users',
      userId,
      'activeQuest',
      questId,
    );
    await updateDoc(userQuestRef, { progress, bossDefeated });

    return {
      success: true,
      data: { questId, progress, bossDefeated, startedAt: Date.now() },
      error: undefined,
    };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error(
        'Error updating quest progress:',
        error.code,
        error.message,
      );
      return {
        success: false,
        data: null,
        error: 'Error updating quest progress. Please try again.',
      };
    } else {
      console.error('Error updating quest progress:', error);
      return {
        success: false,
        data: null,
        error: 'Error updating quest progress. Please try again.',
      };
    }
  }
};

/**
 * Abandon quest
 */
export const abandonQuest = async (
  userId: string,
  questId: string,
): Promise<APIResponse> => {
  try {
    const userQuestRef = doc(
      FIREBASE_DB,
      'users',
      userId,
      'activeQuest',
      questId,
    );
    await updateDoc(userQuestRef, { abandoned: true });

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error('Error abandoning quest:', error.code, error.message);
      return {
        success: false,
        data: null,
        error: 'Error abandoning quest. Please try again.',
      };
    } else {
      console.error('Error abandoning quest:', error);
      return {
        success: false,
        data: null,
        error: 'Error abandoning quest. Please try again.',
      };
    }
  }
};

export const getQuestByID = async (questID: string): Promise<Quest | null> => {
  const userRef = collection(FIREBASE_DB, 'quests').withConverter(
    questConverter,
  );
  const q = query(userRef, where('questId', '==', questID));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  // console.log('foundQuest', querySnapshot.docs[0].data());

  return querySnapshot.docs[0].data();
};
