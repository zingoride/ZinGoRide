
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

  // Directly use environment variables
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
    console.error('Firebase Admin SDK environment variables are missing or invalid.');
    return null;
  }
  
  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
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
