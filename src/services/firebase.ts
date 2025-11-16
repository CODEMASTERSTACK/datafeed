import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyATLt89ZbnXomkeU589BjVkWd5Mwh-b1f4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "home-financer-3d3d5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "home-financer-3d3d5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "home-financer-3d3d5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "235882407822",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:235882407822:web:56e63eca40a26b0ac666df"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;

// If you're running the Firestore emulator locally set VITE_USE_FIRESTORE_EMULATOR=true
if (import.meta.env.VITE_USE_FIRESTORE_EMULATOR === 'true') {
  // default emulator host and port
  const EMULATOR_HOST = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST || 'localhost';
  const EMULATOR_PORT = Number(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT || 8080);
  try {
    connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_PORT);
    // eslint-disable-next-line no-console
    console.info(`Connected Firestore to emulator at ${EMULATOR_HOST}:${EMULATOR_PORT}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Could not connect to Firestore emulator:', err);
  }
}
