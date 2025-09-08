// This file should only be imported on the server-side
import admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json';

let app: admin.app.App | null = null;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    // Return the already initialized app if it exists
    const existingApp = admin.apps.find(a => a?.name === '[DEFAULT]');
    if (existingApp) {
      return existingApp;
    }
  }

  // Ensure all necessary properties exist on the service account object
  const { project_id, private_key, client_email } = serviceAccount as any;
  if (!project_id || !private_key || !client_email) {
    console.error('Firebase Admin SDK service account key is missing required fields.');
    // Explicitly return null if the key is invalid.
    return null;
  }
  
  try {
    // Initialize the app with the service account credentials
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

  // This block will now execute if the initialization failed for any reason (e.g., invalid key)
  if (!app) {
    const errorMsg = "Firebase Admin SDK is not initialized. Check server logs for details. This is likely due to an invalid or revoked service account key.";
    // Return proxies that throw a clear error when any of their methods are accessed.
    // This makes debugging easier as it points directly to the uninitialized SDK.
    return {
      db: new Proxy({}, { get() { throw new Error(errorMsg); } }) as admin.firestore.Firestore,
      auth: new Proxy({}, { get() { throw new Error(errorMsg); } }) as admin.auth.Auth,
      messaging: new Proxy({}, { get() { throw new Error(errorMsg); } }) as admin.messaging.Messaging,
      app: null,
    };
  }
  
  // If initialization was successful, return the actual services.
  return {
    db: admin.firestore(app),
    auth: admin.auth(app),
    messaging: admin.messaging(app),
    app: app,
  };
}
