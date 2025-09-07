// This file should only be imported on the server-side
import admin from 'firebase-admin';

let app: admin.app.App | null = null;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }
  
  // Use individual environment variables instead of the whole JSON file
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  // Only initialize if all credentials are provided
  if (!privateKey || !clientEmail || !projectId) {
    console.warn('Missing Firebase Admin SDK credentials. Skipping Firebase Admin initialization.');
    return null;
  }

  const serviceAccount: admin.ServiceAccount = {
    projectId,
    clientEmail,
    privateKey,
  };

  try {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error("Error initializing Firebase Admin SDK: ", error);
    return null;
  }
}

export function getFirebaseAdmin() {
  if (!app) {
    app = initializeAdminApp();
  }

  if (!app) {
    // Return a mock or empty object if initialization failed
    // to prevent crashes in the code that uses these services.
    return {
      db: {} as admin.firestore.Firestore,
      auth: {} as admin.auth.Auth,
      messaging: {} as admin.messaging.Messaging,
      app: null,
    };
  }
  
  return {
    db: admin.firestore(app),
    auth: admin.auth(app),
    messaging: admin.messaging(app),
    app: app,
  };
}
