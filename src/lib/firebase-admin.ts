
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
      "type": "service_account",
      "project_id": "zingo-ride-48221",
      "private_key_id": "f2538923e8b58472999853f61e55f238051532cc",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDErksVzLIShY9S\nJhsZj7guo3oh+R6+4iPFD40WbxND+d2ZseIqXcyZGRequgzGAqlkRzlN0ogp5YBP\nsyhpQnGmqhgiSb81eDvQU2SqsuaT2UHy+apthz0+vUu1gnMTenWhbCI142Q/YYEV\nGX7KT5hAj1VZSK0LDQg538euDOkfwdIhAs6rzvbsFnmyK9KeUoWuSs/+/MAKXPbh\nnxPsm0pu189G9xrgQ+/JDdRBF4SZ3y9gcXeGyMgvdKXQis/uTQ3Eta309JGukWWq\nTKjdSWva9ldGKcYxTnhvaG0mXhYZwycThzQ5nIeatjfqBnnsKgZJ4hZ99dARm9QF\n++77ouajAgMBAAECggEATb59lKDktNiRhg3lAW4jhl/9a4dvRVHbhM44XWlLqr+O\nfm3nsgqA0PWvur8vRGgR8D8NIjt5smHzHc36R91JUnGC967CA89CiX8lWCo+Zavn\n2zUgToo6Rd4KmrVanoqHERDo5x+aGVQ4nfA/BSJYN+ng5LsP+WHXmUcJ6sXzYKcW\n/zyMYofqyrS3FZln7EDlVMyD4ZTTbwjNOqJ540fO0T30pwMmgWRpuJWD73h1rcR\n7lQQ7TBue/O1cdMfG/zA7Jl6aaIoZu3LCUUuy/X25oUkOANJ6zvmbu8GfPpOXgUa\nvQDPDKanr+MqBw0eXzLe8f2PiRkHCbqn1upUlEfVZQKBgQDz2xQlI5ZxlGfQNH6x\nQWi4nyEcfCUP/DQiDzC6Ave0v+iku/88viCRMQ56T3Vy+D8iOWKXBf+CWuBo7e0n\nNC80JFECha0in+OqlYLT4cFqVKW7tmQbFPB4GgvRgantnwxrJlA6o80zWWWWCiJg\ncnmmNf4Be6Aa4tLLefT639m8RQKBgQDOecfN29b5DwZAZLyAlK0r+mXdSQ7pEb9N\nIDSaJ7VBiJwOmv+LQvg7iFltTVWV9hGCzLTUOh2xj5msituC+fdND3qDjK60v/I9\nFEhB8NsmbzICqig+JBeBgjJ2Mz6pbWIXcsfFf0gcAYcVWC3YYQaeofDTIjf7K4Rw\n9dKsKTipxwKBgGXXNsCT7j6dBgYUBl0svflsq71js27Lm1ImGel1V9Hq29QAl4Xc\nuWkpnaxDBv/u4R7/7Ea6QI1GOrZXt1VKG/SgvhxZi4cMU15odmzauZYYp+aPM5uD\n0TG3XvwuNLOCWwNcyuDSi95IFX7l2JmC9X8OyXgBE0pnNDW6Ry+G0T4pAoGAWyNm\nDnf7a/Q1zjao/hiiV8cvL34QFtC+oEyW63SbjVG/kLLaGZ5189E7qAN6w7baA+JX\n71W3xaidLIweWLH9dwZeDbMLar1PL6bEPlcSZOSwLnztRoCn34KYw5PbFO4zXiZM\nB+Em8zW5arKBigFJ6ruQkaGJFFUhILthQpzvZgECgYAS3c3lioVI3mT4ujxVTw7M\nUZH9Y6IujnfPftSFk7D2tTtK/65aVgmmXBLmKDy3GpOQYTtM0J715ar5k1PorfGy\nGK1BvuRUn07ygamgC/AmuruiHe5D0T6bx4tmTyrqUMYSxDcB2jhpSwODym7pVW7o\nZA4Ytbt5gI0EbqeDO9Ofkw==\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-fbsvc@zingo-ride-48221.iam.gserviceaccount.com",
    };
    
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
        throw new Error("Firebase Admin SDK credentials not found. This is a critical server error.");
    }

    return admin.initializeApp({
      credential: admin.credential.cert({
          projectId: serviceAccount.project_id,
          privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
          clientEmail: serviceAccount.client_email,
      }),
    });
  } catch (error: any) {
    console.error("Fatal: Error initializing Firebase Admin SDK from service account:", error.message);
    return null;
  }
}

export function getFirebaseAdmin() {
  if (!app) {
    app = initializeAdminApp();
  }

  if (!app) {
    const errorMsg = "Firebase Admin SDK is not initialized. This is a critical server error. Check server logs for details.";
    throw new Error(errorMsg);
  }
  
  return {
    db: admin.firestore(app),
    auth: admin.auth(app),
    messaging: admin.messaging(app),
    app: app,
  };
}
