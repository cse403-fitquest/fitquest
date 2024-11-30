// // __tests__/workout.test.ts

// import { fetchItems, setItemsInDB, purchaseItem } from '@/services/item';
// import { FirebaseError } from 'firebase/app';
// import {
//   getDocs,
//   deleteDoc,
//   writeBatch,
//   getDoc,
//   updateDoc,
// } from 'firebase/firestore';
// import { Item } from '@/types/item';
// import { APIResponse } from '@/types/general';
// import { BASE_ITEM } from '@/constants/item';
// import { GetItemsResponse } from '@/types/item';
// import { BASE_USER } from '@/constants/user';

// Mock Firebase Firestore
jest.mock('@/firebaseConfig', () => ({
  FIREBASE_DB: {},
}));

// Mock Firebase Firestore methods
jest.mock('firebase/firestore', () => ({
  collection: jest.fn((_db, collectionName) => ({
    withConverter: jest.fn(() => ({
      path: `${collectionName}`,
    })),
  })),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  writeBatch: jest.fn(() => ({
    set: jest.fn(),
    commit: jest.fn(),
  })),
  doc: jest.fn((collectionRef, id) => ({
    path: `${collectionRef.path}/${id}`,
  })),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn((item) => [item]),
}));
