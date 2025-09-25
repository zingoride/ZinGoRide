
// This file should only be imported on the server-side
import admin from 'firebase-admin';

let app: admin.app.App | null = null;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    const existingApp = admin.apps.find(a => a?.name === '[DEFAULT]');
    if (existingApp) {
      return existingApp;
    }
  }
  
  try {
     const serviceAccount = {
        projectId: "zingo-ride-48221",
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }
    
    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
        // Fallback for when full creds are not available, use application default credentials
        // This is useful for environments like Google Cloud Run
        console.warn("Firebase Admin SDK credentials not found in environment variables. Falling back to Application Default Credentials.");
        return admin.initializeApp();
    }

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error("Fatal: Error initializing Firebase Admin SDK from environment variables:", error.message);
    return null;
  }
}

export function getFirebaseAdmin() {
  if (!app) {
    app = initializeAdminApp();
  }

  if (!app) {
    const errorMsg = "Firebase Admin SDK is not initialized. This is a critical server error. Check server logs for details, likely due to an invalid or revoked service account key or missing environment variables.";
    // Throw an error to make it clear that the services are not available.
    // This prevents the application from continuing in a broken state.
    throw new Error(errorMsg);
  }
  
  return {
    db: admin.firestore(app),
    auth: admin.auth(app),
    messaging: admin.messaging(app),
    app: app,
  };
}
