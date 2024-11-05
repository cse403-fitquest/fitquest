/*Functions:
getDoc(): A firebase firestore function that retrieves a specific document in a specified collection in the database.
getDocs(): A firebase firestore function that retrieves multiple documents in a specified collection in the database.
addDoc(): A firebase firestore function that adds a new document to a specified collection in the database.
updateDoc(): A firebase firestore function that updates an existing document in a specified collection in the database.
deleteDoc(): A firebase firestore function that deletes an existing document in a specified collection in the database.*/
// Import the necessary functions from Firebase SDK
//import { initializeApp } from 'firebase/app';
//import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Comment out to fix unused variable error
// type Exercise = {
//   name: string;
//   sets: number;
//   reps: number;
//   weight: number;
// };
// type workout = {
//   exercises: Exercise[];
// };

// Your web app's Firebase configuration
/*const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-app-id.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket.appspot.com',
  messagingSenderId: 'your-sender-id',
  appId: 'your-app-id',
};

export const secondsToMinutes = (seconds: number) => {
  return (seconds/60)+"m"+(seconds%60)+"s";
}

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to get a document from Firestore
const getDocument = async (collection: string, documentId: string) => {
  try {
    const docRef = doc(db, collection, documentId); // Specify collection and document ID
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      return docSnap.data(); // Return document data
    } else {
      console.log('No such document!');
      return null; // Handle no document case
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error; // Handle errors
  }
};

// Example usage:
// getDocument('users', 'user-id-here').then(data => console.log(data));
//console.log(getDocument('muscles', 'Biceps'));*/

/* converts seconds to xminutes xseconds so for display purposes*/
export const secondsToMinutes = (seconds: number) => {
  return Math.floor(seconds / 60) + 'm' + (seconds % 60) + 's';
};

export const addToTemplate = () => {};
export const removeFromTemplate = () => {};
export const submitTemplate = () => {};
export const resetTemplate = () => {};
