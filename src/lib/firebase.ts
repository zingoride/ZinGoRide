
import { initializeApp, getApp, getApps, FirebaseOptions, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration is loaded from environment variables
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBL4loYZrYlMSoToxOAd8uSY9NCssqxByI",
  authDomain: "zingo-ride-48221.firebaseapp.com",
  databaseURL: "https://zingo-ride-48221-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zingo-ride-48221",
  storageBucket: "zingo-ride-48221.appspot.com",
  messagingSenderId: "500373438211",
  appId: "1:500373438211:web:0a9487df34a2400c827336"
};

// Initialize Firebase as a singleton
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

if (getApps().length) {
  app = getApp();
} else {
  app = initializeApp(firebaseConfig);
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

if (typeof window !== 'undefined') {
  isSupported().then((yes) => {
      if (yes) {
      analytics = getAnalytics(app);
      }
  });
}


export { app, auth, db, storage, analytics };
