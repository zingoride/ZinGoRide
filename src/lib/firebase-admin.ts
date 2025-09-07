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

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY. Please set it in your environment variables.');
  }

  const serviceAccount = JSON.parse(serviceAccountKey);

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return {
    db: admin.firestore(app),
    auth: admin.auth(app),
    messaging: admin.messaging(app),
    app: app,
  };
}
