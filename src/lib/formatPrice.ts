/**
 * Formate un montant en FCFA avec des espaces visibles garantis (ex: 10 000, 8 500, 75 000).
 * Résout le problème des navigateurs Windows/Desktop où toLocaleString('fr-FR')
 * utilise \u202F (espace insécable fin) qui s'affiche sans espace sur certains écrans.
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || price === "") return "0";
  const cleanStr = String(price).replace(/[^0-9.-]/g, "");
  const num = Math.round(Number(cleanStr) || 0);
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default formatPrice;

