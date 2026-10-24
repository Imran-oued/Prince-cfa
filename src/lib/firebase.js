import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialiser Firebase (éviter de re-initialiser en dev avec hot-reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Base de données Firestore (produits, commandes, etc.)
export const db = getFirestore(app);

// Storage pour les images de produits
export const storage = getStorage(app);

// Vérifier si Firebase est configuré (pas les valeurs par défaut)
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "VOTRE_CLE_API_ICI" &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "votre-projet"
  );
};

export default app;
