import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Look for a service account key file
const serviceAccountPath = path.resolve(__dirname, '../../firebase-service-account.json');

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('🔥 Firebase Admin initialized with service account.');
  } else {
    // If running in an environment with Google Application Default Credentials
    admin.initializeApp();
    console.log('🔥 Firebase Admin initialized with default credentials.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

export const firebaseAdmin = admin;
