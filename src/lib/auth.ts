import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
export const ADMIN_COOKIE_NAME = "prince_cfa_admin_auth";

/**
 * Générer un token d'administration simple et sécurisé
 */
export function generateAdminToken(): string {
  const secret = Buffer.from(`${ADMIN_PASSWORD}:prince_cfa_salt_2026`).toString("base64");
  return `adm_${secret}`;
}

/**
 * Vérifier si une requête provient d'un administrateur autorisé
 */
export async function verifyAdminAuth(request: Request): Promise<boolean> {
  // 1. Vérification header Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token === generateAdminToken() || token === ADMIN_PASSWORD) {
      return true;
    }
  }

  // 2. Vérification Cookie HTTP
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (cookie && (cookie.value === generateAdminToken() || cookie.value === ADMIN_PASSWORD)) {
      return true;
    }
  } catch {
    // Si cookies() n'est pas disponible dans le contexte actuel
  }

  return false;
}
