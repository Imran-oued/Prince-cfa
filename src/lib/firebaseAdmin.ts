import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;

/**
 * Détermine si les identifiants Firebase Admin sont configurés dans l'environnement serveur.
 */
export function isAdminConfigured(): boolean {
  if (typeof window !== "undefined") return false;
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    (process.env.FIREBASE_CLIENT_EMAIL && (process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PROJECT_ID))
  );
}

/**
 * Initialise ou récupère l'application Firebase Admin (Singleton).
 * Supporte :
 * 1. FIREBASE_SERVICE_ACCOUNT_KEY (chaîne JSON complète du compte de service)
 * 2. Variables distinctes : FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 */
export function getAdminApp(): App | null {
  if (typeof window !== "undefined") {
    return null;
  }

  if (cachedApp) {
    return cachedApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    cachedApp = existingApps[0];
    return cachedApp;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "prince-cfa";

  // Option 1 : Compte de service fourni sous forme de chaîne JSON complète
  if (serviceAccountJson) {
    try {
      const parsed = JSON.parse(serviceAccountJson);
      cachedApp = initializeApp({
        credential: cert(parsed),
        projectId: parsed.project_id || projectId,
      });
      return cachedApp;
    } catch (err) {
      console.error("[firebaseAdmin] Échec analyse FIREBASE_SERVICE_ACCOUNT_KEY:", err);
    }
  }

  // Option 2 : Variables d'environnement individuelles (standard Cloud / Hostinger)
  if (clientEmail && privateKeyRaw) {
    try {
      // Remplacement sécurisé des retours à la ligne échappés (\n -> saut réel)
      const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
      cachedApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
      });
      return cachedApp;
    } catch (err) {
      console.error("[firebaseAdmin] Échec initialisation cert Firebase Admin:", err);
    }
  }

  return null;
}

/**
 * Récupère l'instance Firestore sécurisée de Firebase Admin SDK.
 * Bypasse les règles de sécurité Firestore via l'autorité du compte de service,
 * permettant de verrouiller les règles publiques à `allow read, write: if false;`.
 * Retourne `null` si les identifiants ne sont pas configurés (permettant le repli en mode test/local).
 */
export function getAdminFirestore(): Firestore | null {
  if (typeof window !== "undefined") {
    return null;
  }

  if (cachedDb) {
    return cachedDb;
  }

  const app = getAdminApp();
  if (!app) {
    return null;
  }

  try {
    cachedDb = getFirestore(app);
    return cachedDb;
  } catch (err) {
    console.error("[firebaseAdmin] Erreur lors de l'obtention de getFirestore(app):", err);
    return null;
  }
}
