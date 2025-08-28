// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbo9RRH8bHZDqZ-N9jqdlBA9jUoIeDb6c",
  authDomain: "blogging-app-29017.firebaseapp.com",
  projectId: "blogging-app-29017",
  storageBucket: "blogging-app-29017.firebasestorage.app",
  messagingSenderId: "814160548349",
  appId: "1:814160548349:web:9ee9570bdf4dc3530d4994",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
