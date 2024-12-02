import { FIREBASE_DB } from '@/firebaseConfig';
import { Monster, MonsterResponse } from '@/types/monster';
import { FirebaseError } from 'firebase/app';

import {
  collection,
  getDocs,
  doc,
  getDoc,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

export const monsterConverter = {
  toFirestore: (data: Monster) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Monster,
};

/**
 * Get all monsters from Firestore
 */
export const getMonsters = async (): Promise<MonsterResponse> => {
  try {
    const monsterCollection = collection(FIREBASE_DB, 'monsters').withConverter(
      monsterConverter,
    );
    const monstersSnapshot = await getDocs(monsterCollection);
    const monsters = monstersSnapshot.docs.map((doc) => doc.data());

    return {
      success: true,
      data: { monsters },
      error: undefined,
    };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error('Error getting monsters:', error.code, error.message);
      return {
        success: false,
        data: null,
        error: 'Error getting monsters. Please try again.',
      };
    } else {
      console.error('Error getting monsters:', error);
      return {
        success: false,
        data: null,
        error: 'Error getting monsters. Please try again.',
      };
    }
  }
};

// Add a new function to get a specific monster by ID
export const getMonsterById = async (
  monsterId: string,
): Promise<Monster | null> => {
  try {
    const monsterDoc = await getDoc(doc(FIREBASE_DB, 'monsters', monsterId));
    if (monsterDoc.exists()) {
      return monsterDoc.data() as Monster;
    }
    return null;
  } catch (error) {
    console.error('Error getting monster by ID:', error);
    return null;
  }
};

// Add a function to get a random monster from a list of IDs
export const getRandomMonster = async (
  monsterIds: string[],
): Promise<Monster | null> => {
  try {
    if (monsterIds.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * monsterIds.length);
    const randomMonsterId = monsterIds[randomIndex];

    return await getMonsterById(randomMonsterId);
  } catch (error) {
    console.error('Error getting random monster:', error);
    return null;
  }
};
