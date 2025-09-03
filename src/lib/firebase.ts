// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD10S57n2TnmHVs3EhTAp3EwCxHdCi-ezA",
  authDomain: "zingo-ride.firebaseapp.com",
  databaseURL: "https://zingo-ride-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zingo-ride",
  storageBucket: "zingo-ride.firebasestorage.app",
  messagingSenderId: "32409199639",
  appId: "1:32409199639:web:0f867b422f3cc7cde52852",
  measurementId: "G-MZ8WKSV82J"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, auth, db, analytics };