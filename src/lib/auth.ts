import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const AUTH_SECRET = process.env.ADMIN_JWT_SECRET || `${ADMIN_PASSWORD}:prince_cfa_secure_key_2026`;
export const ADMIN_COOKIE_NAME = "prince_cfa_admin_auth";

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
 * Vérifier le mot de passe admin de façon cryptographiquement sûre
 */
export function verifyAdminPassword(password: string): boolean {
  if (!password || typeof password !== "string") return false;
  return timingSafeEqualString(password, ADMIN_PASSWORD);
}

/**
 * Signer une chaîne avec HMAC-SHA256
 */
function signPayload(payload: string): string {
  return crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
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
 * Valider cryptographiquement un token d'administration
 */
export function validateAdminToken(token: string): boolean {
  if (!token || typeof token !== "string") return false;

  // 1. Format moderne signé HMAC : adm.<timestamp>.<nonce>.<signature>
  if (token.startsWith("adm.")) {
    const parts = token.slice(4).split(".");
    if (parts.length === 3) {
      const [timestampStr, nonce, signature] = parts;
      const timestamp = parseInt(timestampStr, 36);

      // Vérifier si le token n'a pas expiré (24h)
      if (isNaN(timestamp) || Date.now() - timestamp > TOKEN_TTL_MS || timestamp > Date.now() + 60000) {
        return false;
      }

      const expectedSignature = signPayload(`${timestampStr}.${nonce}`);
      return timingSafeEqualString(signature, expectedSignature);
    }
  }

  // 2. Rétrocompatibilité transitoire avec l'ancien format base64
  const legacySecret = Buffer.from(`${ADMIN_PASSWORD}:prince_cfa_salt_2026`).toString("base64");
  const legacyToken = `adm_${legacySecret}`;
  if (timingSafeEqualString(token, legacyToken)) {
    return true;
  }

  return false;
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
