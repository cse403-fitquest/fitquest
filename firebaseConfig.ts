// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDZq4Z6931YsBCyafLXMM9ZtdqZWlyhXro',
  authDomain: 'fitquest-690f6.firebaseapp.com',
  projectId: 'fitquest-690f6',
  storageBucket: 'fitquest-690f6.appspot.com',
  messagingSenderId: '671377617580',
  appId: '1:671377617580:web:3e5a89dc381a696d50a509',
  measurementId: 'G-JMMCS8RYRY',
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Get a reference to the authentication service
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Get a reference to the database service
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
