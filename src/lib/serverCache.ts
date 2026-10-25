import { getProducts as getFirestoreProducts, getOrders as getFirestoreOrders } from "./firestore.js";
import { products as defaultProducts } from "../data/products.js";

// Cache mémoire serveur pour les produits du catalogue
interface ProductsCacheEntry {
  data: any[];
  expiresAt: number;
}

let productsCache: ProductsCacheEntry | null = null;
const PRODUCTS_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Récupère le catalogue de produits avec mise en cache mémoire côté serveur.
 * Élimine les lectures répétitives de Firestore sous forte charge concurrente.
 */
export async function getCachedProducts(): Promise<any[]> {
  const now = Date.now();

  if (productsCache && now < productsCache.expiresAt) {
    return productsCache.data;
  }

  try {
    const cloudProducts = await getFirestoreProducts();
    if (cloudProducts && Array.isArray(cloudProducts) && cloudProducts.length > 0) {
      // Fusionner avec les produits par défaut non présents
      const existingIds = new Set(cloudProducts.map((p: any) => String(p.id)));
      const missingDefaults = (defaultProducts as any[]).filter(dp => !existingIds.has(String(dp.id)));
      const combined = [...cloudProducts, ...missingDefaults];

      productsCache = {
        data: combined,
        expiresAt: now + PRODUCTS_TTL_MS,
      };
      return combined;
    }
  } catch (error) {
    console.warn("[serverCache] Impossible de charger Firestore, utilisation du catalogue par défaut:", error);
  }

  // Fallback si Firestore indisponible ou vide
  const fallback = defaultProducts as any[];
  productsCache = {
    data: fallback,
    expiresAt: now + 60 * 1000, // Réessayer dans 1 minute
  };
  return fallback;
}

/**
 * Invalide immédiatement le cache des produits (ex: lors d'un ajout / modification admin).
 */
export function invalidateProductsCache(): void {
  productsCache = null;
}

// Cache mémoire serveur pour la liste des commandes (utilisé pour les recherches de suivi)
interface OrdersCacheEntry {
  data: any[];
  expiresAt: number;
}

let ordersCache: OrdersCacheEntry | null = null;
const ORDERS_TTL_MS = 30 * 1000; // 30 secondes pour une fraîcheur maximale

/**
 * Récupère les commandes avec une fenêtre de cache courte (30 secondes)
 * pour éviter les scans complets de collection Firestore lors de requêtes de suivi concurrentes.
 */
export async function getCachedOrders(): Promise<any[]> {
  const now = Date.now();

  if (ordersCache && now < ordersCache.expiresAt) {
    return ordersCache.data;
  }

  try {
    const orders = await getFirestoreOrders();
    ordersCache = {
      data: orders || [],
      expiresAt: now + ORDERS_TTL_MS,
    };
    return ordersCache.data;
  } catch (error) {
    console.warn("[serverCache] Impossible de charger les commandes:", error);
    return ordersCache ? ordersCache.data : [];
  }
}

/**
 * Invalide immédiatement le cache des commandes (ex: lors d'une nouvelle commande ou validation admin).
 */
export function invalidateOrdersCache(): void {
  ordersCache = null;
}
