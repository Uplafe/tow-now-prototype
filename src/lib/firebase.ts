// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: "townow-60948.firebaseapp.com",
  projectId: "townow-60948",
  storageBucket: "townow-60948.firebasestorage.app",
  messagingSenderId: "986085167769",
  appId: "1:986085167769:web:88a5b1ce7e52c8382b9e08",
  measurementId: "G-TTXHL41X7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
