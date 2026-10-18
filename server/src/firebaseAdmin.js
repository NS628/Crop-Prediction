// Firebase Admin SDK integration (Backend Cloud Services)
import admin from "firebase-admin";

let adminApp = null;
let adminDb = null;
let adminAuth = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    adminDb = admin.firestore();
    adminAuth = admin.auth();
    console.log("Firebase Admin SDK initialized successfully.");
  } else if (process.env.FIREBASE_PROJECT_ID) {
    adminApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    adminDb = admin.firestore();
    adminAuth = admin.auth();
    console.log("Firebase Admin SDK initialized with project ID.");
  }
} catch (err) {
  console.warn("Firebase Admin SDK initialization skipped (no credentials provided):", err.message);
}

export { adminApp, adminDb, adminAuth };
