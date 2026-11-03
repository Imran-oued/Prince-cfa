import crypto from "crypto";

// En production, interdiction formelle d'utiliser "admin" comme mot de passe par défaut
function getAdminPassword(): string {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? "" : "admin";
}

/**
 * Obtenir et valider le secret de signature JWT (ADMIN_JWT_SECRET).
 * 
 * Règles strictes :
 * 1. En production (NODE_ENV === "production") :
 *    - ADMIN_JWT_SECRET est strictement obligatoire.
 *    - Doit contenir au minimum 32 caractères pour une entropie cryptographique suffisante.
 *    - Toute valeur absente, vide ou < 32 caractères lève une exception explicite.
 *    - Aucune dérivation de secours depuis ADMIN_PASSWORD n'est autorisée.
 *    - Aucun secret statique par défaut n'est utilisé.
 * 2. Hors production (tests unitaires, développement local) :
 *    - Utilise ADMIN_JWT_SECRET s'il est configuré.
 *    - Sinon, utilise une clé de test dédiée locale sans bloquer les suites de tests locales.
 */
export function getAuthSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    if (!secret || typeof secret !== "string" || secret.trim().length < 32) {
      throw new Error(
        "[SÉCURITÉ CRITIQUE] ADMIN_JWT_SECRET est absent, vide ou inférieur à 32 caractères en environnement de production. " +
        "L'authentification administrateur est strictement bloquée pour empêcher tout secret faible."
      );
    }
    return secret.trim();
  }

  // Hors production (tests / développement local)
  if (secret && typeof secret === "string" && secret.trim().length > 0) {
    return secret.trim();
  }

  return "dev_test_jwt_secret_only_local_32_chars_long_minimum!";
}

export const ADMIN_COOKIE_NAME = "prince_cfa_admin_auth";

// Avertissement de sécurité au démarrage si la configuration de production est incomplète
if (process.env.NODE_ENV === "production") {
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === "admin" || process.env.ADMIN_PASSWORD.length < 8) {
    console.warn(
      "[SÉCURITÉ CRITIQUE] La variable ADMIN_PASSWORD n'est pas définie ou utilise 'admin' en production ! " +
      "Veuillez définir un mot de passe robuste dans vos variables d'environnement Hostinger."
    );
  }
  if (!process.env.ADMIN_JWT_SECRET || process.env.ADMIN_JWT_SECRET.trim().length < 32) {
    console.warn(
      "[SÉCURITÉ CRITIQUE] La variable ADMIN_JWT_SECRET est absente ou inférieure à 32 caractères en production ! " +
      "L'authentification administrateur sera bloquée tant qu'un secret d'au moins 32 caractères n'est pas configuré."
    );
  }
}

// Durée de validité du token admin : 4 heures (session de travail sécurisée)
const TOKEN_TTL_MS = 4 * 60 * 60 * 1000;

async function getCookieStore() {
  try {
    const { cookies } = await import("next/headers");
    return await cookies();
  } catch {
    return null;
  }
}

/**
 * Comparaison sécurisée en temps constant pour éviter les attaques temporelles (Timing Attacks)
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Calculer quand même sur un buffer factice pour garder un temps stable
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Vérifier le mot de passe admin de façon cryptographiquement sûre.
 * En production, le mot de passe "admin" est strictement refusé.
 */
export function verifyAdminPassword(password: string): boolean {
  if (!password || typeof password !== "string") return false;
  if (process.env.NODE_ENV === "production") {
    if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === "admin" || process.env.ADMIN_PASSWORD.length < 8) {
      console.error(
        "[SÉCURITÉ] Connexion refusée : ADMIN_PASSWORD absent, trop court (<8 caractères) ou non sécurisé en environnement de production."
      );
      return false;
    }
  }
  return timingSafeEqualString(password, getAdminPassword());
}

/**
 * Signer une chaîne avec HMAC-SHA256
 */
function signPayload(payload: string): string {
  const secret = getAuthSecret();
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Générer un token d'administration sécurisé signé par HMAC-SHA256 avec horodatage et nonce
 * Format: adm.<timestamp>.<nonce>.<hmacSignature>
 */
export function generateAdminToken(): string {
  const timestamp = Date.now().toString(36);
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = `${timestamp}.${nonce}`;
  const signature = signPayload(payload);
  return `adm.${payload}.${signature}`;
}

/**
 * Valider cryptographiquement un token d'administration.
 * En production, aucun fallback dérivé de mot de passe n'est toléré.
 */
export function validateAdminToken(token: string): boolean {
  if (!token || typeof token !== "string") return false;

  try {
    // 1. Format moderne signé HMAC : adm.<timestamp>.<nonce>.<signature>
    if (token.startsWith("adm.")) {
      const parts = token.slice(4).split(".");
      if (parts.length === 3) {
        const [timestampStr, nonce, signature] = parts;
        const timestamp = parseInt(timestampStr, 36);

        // Vérifier si le token n'a pas expiré (4h)
        if (isNaN(timestamp) || Date.now() - timestamp > TOKEN_TTL_MS || timestamp > Date.now() + 60000) {
          return false;
        }

        const expectedSignature = signPayload(`${timestampStr}.${nonce}`);
        return timingSafeEqualString(signature, expectedSignature);
      }
    }

    // 2. Rétrocompatibilité transitoire avec l'ancien format base64
    // STRICTEMENT INTERDIT EN PRODUCTION : aucun fallback dérivé du mot de passe en production
    if (process.env.NODE_ENV !== "production") {
      const adminPwd = getAdminPassword();
      if (adminPwd) {
        const legacySecret = Buffer.from(`${adminPwd}:prince_cfa_salt_2026`).toString("base64");
        const legacyToken = `adm_${legacySecret}`;
        if (timingSafeEqualString(token, legacyToken)) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error(
      "[SÉCURITÉ] Échec de validation du token administrateur:",
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

/**
 * Vérifier si une requête provient d'un administrateur autorisé
 */
export async function verifyAdminAuth(request: Request): Promise<boolean> {
  // 1. Vérification header Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (validateAdminToken(token)) {
      return true;
    }
  }

  // 2. Vérification Cookie HTTP sécurisé
  try {
    const cookieStore = await getCookieStore();
    if (cookieStore) {
      const cookie = cookieStore.get(ADMIN_COOKIE_NAME);
      if (cookie?.value && validateAdminToken(cookie.value)) {
        return true;
      }
    }
  } catch {
    // Si cookies() n'est pas disponible dans le contexte actuel
  }

  return false;
}
