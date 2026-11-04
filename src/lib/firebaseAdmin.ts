import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { ensureEnvLoaded } from "./envLoader.ts";

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;

let hasLoggedProdWarning = false;
let lastInitError: string | null = null;
let lastFirestoreError: string | null = null;

/**
 * Normalise et assainit une clé privée RSA PEM issue de variables d'environnement.
 * Corrige automatiquement :
 * - Les guillemets superflus (simples ou doubles)
 * - Les retours à la ligne échappés (\n, \\n, \r\n)
 * - Le wrapping du corps base64 brut sans en-têtes PEM
 * - Les objets JSON complets collés par mégarde
 */
export function normalizePrivateKey(raw: string): string {
  if (!raw || typeof raw !== "string") return "";

  let key = raw.trim();

  // 1. Déshabillage des guillemets englobants multiples
  while (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }

  // 2. Détection d'un JSON complet collé par erreur dans FIREBASE_PRIVATE_KEY
  if (key.startsWith("{") && key.endsWith("}")) {
    try {
      const parsed = JSON.parse(key);
      if (parsed.private_key) {
        return normalizePrivateKey(parsed.private_key);
      }
    } catch {}
  }

  // 3. Normalisation des sauts de ligne échappés
  key = key.replace(/\\r\\n/g, "\n").replace(/\r\n/g, "\n");
  key = key.replace(/\\n/g, "\n");

  // 4. Détection et restauration des en-têtes PEM
  const hasBegin = key.includes("-----BEGIN PRIVATE KEY-----") || key.includes("-----BEGIN RSA PRIVATE KEY-----");
  const hasEnd = key.includes("-----END PRIVATE KEY-----") || key.includes("-----END RSA PRIVATE KEY-----");

  if (!hasBegin && !hasEnd && key.length > 500) {
    key = `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`;
  }

  // 5. Garantir que BEGIN et END sont isolés sur leur propre ligne
  if (key.includes("-----BEGIN PRIVATE KEY-----") && !key.includes("-----BEGIN PRIVATE KEY-----\n")) {
    key = key.replace("-----BEGIN PRIVATE KEY-----", "-----BEGIN PRIVATE KEY-----\n");
  }
  if (key.includes("-----END PRIVATE KEY-----") && !key.includes("\n-----END PRIVATE KEY-----")) {
    key = key.replace("-----END PRIVATE KEY-----", "\n-----END PRIVATE KEY-----");
  }

  return key.trim();
}

/**
 * Retourne la dernière erreur d'initialisation de Firebase Admin SDK.
 */
export function getAdminInitError(): string | null {
  return lastInitError || lastFirestoreError;
}

/**
 * Détermine si les identifiants Firebase Admin sont configurés dans l'environnement serveur.
 * Exige soit FIREBASE_SERVICE_ACCOUNT_KEY (JSON), soit FIREBASE_CLIENT_EMAIL ET FIREBASE_PRIVATE_KEY.
 */
export function isAdminConfigured(): boolean {
  if (typeof window !== "undefined") return false;
  ensureEnvLoaded();
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
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

  ensureEnvLoaded();

  if (cachedApp) {
    return cachedApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    cachedApp = existingApps[0];
    lastInitError = null;
    return cachedApp;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const rawClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  const rawProjectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "price-cfa";

  const cleanProjectId = rawProjectId ? rawProjectId.trim().replace(/^["']+|["']+$/g, "") : "price-cfa";
  const cleanClientEmail = rawClientEmail ? rawClientEmail.trim().replace(/^["']+|["']+$/g, "") : "";

  // Option 1 : Compte de service fourni sous forme de chaîne JSON complète
  if (serviceAccountJson) {
    try {
      let cleanJson = serviceAccountJson.trim();
      if ((cleanJson.startsWith("'") && cleanJson.endsWith("'")) || (cleanJson.startsWith('"') && cleanJson.endsWith('"'))) {
        cleanJson = cleanJson.slice(1, -1).trim();
      }
      const parsed = JSON.parse(cleanJson);
      cachedApp = initializeApp({
        credential: cert(parsed),
        projectId: parsed.project_id || cleanProjectId,
      });
      lastInitError = null;
      console.log("[firebaseAdmin] Application initialisée via FIREBASE_SERVICE_ACCOUNT_KEY");
      return cachedApp;
    } catch (err: any) {
      lastInitError = `Échec FIREBASE_SERVICE_ACCOUNT_KEY: ${err?.message || err}`;
      console.error("[firebaseAdmin]", lastInitError);
    }
  }

  // Option 2 : Variables d'environnement individuelles (standard Cloud / Hostinger)
  if (cleanClientEmail && privateKeyRaw) {
    try {
      const privateKey = normalizePrivateKey(privateKeyRaw);

      if (!privateKey.includes("-----BEGIN") || !privateKey.includes("-----END")) {
        lastInitError = `FIREBASE_PRIVATE_KEY invalide (en-têtes PEM absents, longueur: ${privateKey.length})`;
        console.error("[firebaseAdmin]", lastInitError);
        return null;
      }

      cachedApp = initializeApp({
        credential: cert({
          projectId: cleanProjectId,
          clientEmail: cleanClientEmail,
          privateKey,
        }),
        projectId: cleanProjectId,
      });
      lastInitError = null;
      console.log("[firebaseAdmin] Application initialisée avec succès pour le projet :", cleanProjectId);
      return cachedApp;
    } catch (err: any) {
      lastInitError = `Échec cert Firebase Admin: ${err?.message || err}`;
      console.error("[firebaseAdmin]", lastInitError);
      return null;
    }
  }

  // Si ni Option 1 ni Option 2 ne disposent des variables minimales
  if (!serviceAccountJson && (!cleanClientEmail || !privateKeyRaw)) {
    const missing: string[] = [];
    if (!cleanClientEmail) missing.push("FIREBASE_CLIENT_EMAIL");
    if (!privateKeyRaw) missing.push("FIREBASE_PRIVATE_KEY");
    lastInitError = `Variables manquantes : ${missing.join(", ")}`;
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
    if (process.env.NODE_ENV === "production" && !hasLoggedProdWarning) {
      hasLoggedProdWarning = true;
      console.error(
        "[SÉCURITÉ CRITIQUE] Firebase Admin n'est pas initialisé en production ! " +
        `Raison: ${lastInitError || "Identifiants non configurés"}. ` +
        "Veuillez vérifier vos variables d'environnement dans Hostinger."
      );
    }
    return null;
  }

  try {
    cachedDb = getFirestore(app);
    lastFirestoreError = null;
    return cachedDb;
  } catch (err: any) {
    lastFirestoreError = `Erreur getFirestore(app): ${err?.message || err}`;
    console.error("[firebaseAdmin]", lastFirestoreError);
    return null;
  }
}
