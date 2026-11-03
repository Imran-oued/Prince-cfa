/**
 * Utilitaires partagés pour la gestion du cycle de vie et l'expiration des commandes.
 * Utilisable côté client (React) et côté serveur (API / Node) sans dépendance Firebase.
 */

export const ORDER_EXPIRATION_HOURS = 48;

/**
 * Vérifie si une commande est expirée (non payée après le délai alloué, par défaut 48h)
 * @param {any} order
 * @param {number} [expirationHours=48]
 * @returns {boolean}
 */
export function isOrderExpired(order: any, expirationHours: number = ORDER_EXPIRATION_HOURS): boolean {
  if (!order || !order.createdAt) return false;
  // Si le paiement est confirmé, la commande est active et ne peut jamais expirer
  if (order.payment?.status === "confirme") return false;
  // Si la commande est déjà en cours de préparation, en livraison ou livrée
  if (["paye_en_preparation", "en_livraison", "livre"].includes(order.orderStatus)) return false;
  // Si déjà annulée manuellement
  if (order.orderStatus === "annule") return false;

  const createdAtMs = new Date(order.createdAt).getTime();
  if (isNaN(createdAtMs) || createdAtMs <= 0) return false;

  const ageMs = Date.now() - createdAtMs;
  return ageMs > expirationHours * 60 * 60 * 1000;
}
