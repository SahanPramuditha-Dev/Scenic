import 'dotenv/config';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import path from 'path';
import fs from 'fs';

// Look for a service account key file
const serviceAccountPath = path.resolve(__dirname, '../../firebase-service-account.json');

if (getApps().length === 0) {
  if (fs.existsSync(serviceAccountPath)) {
    initializeApp({ credential: cert(JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))) });
  } else if (process.env.FIREBASE_PROJECT_ID) {
    // Verifying Firebase ID tokens only needs the project ID and Google's public keys.
    initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
  } else {
    initializeApp({ credential: applicationDefault() });
  }
}
