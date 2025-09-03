
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD10S57n2TnmHVs3EhTAp3EwCxHdCi-ezA",
  authDomain: "zingo-ride.firebaseapp.com",
  projectId: "zingo-ride",
  storageBucket: "zingo-ride.appspot.com",
  messagingSenderId: "32409199639",
  appId: "1:32409199639:web:0f867b422f3cc7cde52852",
  measurementId: "G-MZ8WKSV82J"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (sirf browser pe kaam karega)
let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };
