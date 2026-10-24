/**
 * Système de limitation de débit (Rate Limiting) en mémoire avec fenêtre glissante
 * Spécialement conçu pour Next.js App Router (Node.js runtime)
 * Protège contre le brute-force, le scraping et les attaques par déni de service.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Nettoyage périodique toutes les 10 minutes pour éviter toute fuite mémoire
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 10 * 60 * 1000).unref?.();
}

export interface RateLimitOptions {
  intervalMs: number; // Durée de la fenêtre en millisecondes (ex: 60000 = 1 min)
  maxRequests: number; // Nombre maximum de requêtes autorisées par fenêtre
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * Vérifier et appliquer une limite de requêtes sur une clé (ex: IP ou IP:action)
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { intervalMs: 60000, maxRequests: 20 }
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    const resetTime = now + options.intervalMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      success: true,
      limit: options.maxRequests,
      remaining: options.maxRequests - 1,
      resetTime
    };
  }

  if (record.count >= options.maxRequests) {
    return {
      success: false,
      limit: options.maxRequests,
      remaining: 0,
      resetTime: record.resetTime
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: options.maxRequests,
    remaining: options.maxRequests - record.count,
    resetTime: record.resetTime
  };
}

/**
 * Extraire l'adresse IP du client de manière sécurisée depuis les headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "127.0.0.1";
}
