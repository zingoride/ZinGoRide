
// This file should only be imported on the server-side
import admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json';

let app: admin.app.App | null = null;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    const existingApp = admin.apps.find(a => a?.name === '[DEFAULT]');
    if (existingApp) {
      return existingApp;
    }
  }

  const { project_id, private_key, client_email } = serviceAccount as any;
  if (!project_id || !private_key || !client_email) {
    console.error('Firebase Admin SDK service account key is missing or invalid.');
    return null;
  }
  
  try {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (error: any) {
    console.error("Fatal: Error initializing Firebase Admin SDK:", error.message);
    return null;
  }
}

export function getFirebaseAdmin() {
  if (!app) {
    app = initializeAdminApp();
  }

  if (!app) {
    const errorMsg = "Firebase Admin SDK is not initialized. This is a critical server error. Check server logs for details, likely due to an invalid or revoked service account key.";
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
