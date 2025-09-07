// This file should only be imported on the server-side
import admin from 'firebase-admin';

let app: admin.app.App;

export function getFirebaseAdmin() {
  if (app) {
    return {
      db: admin.firestore(app),
      auth: admin.auth(app),
      messaging: admin.messaging(app),
      app: app,
    };
  }

  // Use individual environment variables instead of the whole JSON file
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error('Missing Firebase Admin SDK credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your environment variables.');
  }

  const serviceAccount: admin.ServiceAccount = {
    projectId,
    clientEmail,
    privateKey,
  };

  try {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    if (error.code === 'app/duplicate-app') {
       app = admin.app();
    } else {
      throw error;
    }
  }


  return {
    db: admin.firestore(app),
    auth: admin.auth(app),
    messaging: admin.messaging(app),
    app: app,
  };
}
