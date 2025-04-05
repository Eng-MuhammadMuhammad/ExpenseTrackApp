import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyAiRWSCd2GcKNSaWod37xGRODthgGTDqjE",
//   authDomain: "expensetracker-51da7.firebaseapp.com",
//   projectId: "expensetracker-51da7",
//   storageBucket: "expensetracker-51da7.firebasestorage.app",
//   messagingSenderId: "399604625797",
//   appId: "1:399604625797:web:a9290f65999c60c91dd4ec",
//   measurementId: "G-46KX6EVL5N",
// };

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
