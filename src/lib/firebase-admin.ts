// This file should only be imported on the server-side
import admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json';

let app: admin.app.App | null = null;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Ensure all necessary properties exist on the service account object
  const { project_id, private_key, client_email } = serviceAccount as any;
  if (!project_id || !private_key || !client_email) {
    console.error('Firebase Admin SDK service account key is missing required fields.');
    return null;
  }
  
  try {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (error: any) {
    console.error("Error initializing Firebase Admin SDK: ", error.message);
    // Log the error but don't re-throw to avoid crashing the server on startup.
    // The getFirebaseAdmin function will handle the null app case.
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
    // This provides a clear failure point in the code that calls these services.
    const errorMsg = "Firebase Admin SDK is not initialized. Check server logs for details.";
    return {
      db: new Proxy({}, { get() { throw new Error(errorMsg); } }) as admin.firestore.Firestore,
      auth: new Proxy({}, { get() { throw new Error(errorMsg); } }) as admin.auth.Auth,
      messaging: new Proxy({}, { get() { throw new Error(errorMsg); } }) as admin.messaging.Messaging,
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
