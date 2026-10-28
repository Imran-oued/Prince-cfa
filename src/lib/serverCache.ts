import { getProducts as getFirestoreProducts, getOrders as getFirestoreOrders, getDeletedProductIds } from "./firestore.js";
import { products as defaultProducts } from "../data/products.js";

// Cache mémoire serveur pour les produits du catalogue
interface ProductsCacheEntry {
  data: any[];
  jsonString: string;
  etag: string;
  expiresAt: number;
}

let productsCache: ProductsCacheEntry | null = null;
const PRODUCTS_TTL_MS = 5 * 60 * 1000; // 5 minutes

function buildCacheEntry(products: any[], ttlMs: number): ProductsCacheEntry {
  const jsonString = JSON.stringify({ success: true, products });
  // Générer un ETag déterministe et ultra-rapide basé sur la taille et le timestamp
  let hash = 0;
  for (let i = 0; i < jsonString.length; i = i + 16) {
    hash = (hash << 5) - hash + jsonString.charCodeAt(i);
    hash |= 0;
  }
  const etag = `W/"prod-${Math.abs(hash).toString(36)}-${products.length}"`;

  return {
    data: products,
    jsonString,
    etag,
    expiresAt: Date.now() + ttlMs,
  };
}

function sanitizeProductMedia(product: any): any {
  if (!product) return product;
  let image = product.image;
  let images = Array.isArray(product.images) ? [...product.images] : [];
  let modified = false;

  // Remplacement des Base64 par les chemins de fichiers statiques propres
  if (typeof image === "string" && image.startsWith("data:image/")) {
    if (product.id === "UOGdbGVosnh6CovWNOkD") {
      image = "/products/mobility/moto-electrique-1.jpg";
      modified = true;
    }
  }

  if (Array.isArray(images) && images.length > 0) {
    images = images.map((img: any, idx: number) => {
      if (typeof img === "string" && img.startsWith("data:image/")) {
        if (product.id === "UOGdbGVosnh6CovWNOkD") {
          modified = true;
          return idx === 1 ? "/products/mobility/moto-electrique-2.jpg" : "/products/mobility/moto-electrique-1.jpg";
        }
      }
      return img;
    });
  }

  if (!modified) return product;
  return {
    ...product,
    image,
    images,
  };
}

/**
 * Charge ou rafraîchit l'entrée de cache des produits.
 */
async function loadProductsCacheEntry(): Promise<ProductsCacheEntry> {
  const now = Date.now();
  if (productsCache && now < productsCache.expiresAt) {
    return productsCache;
  }

  let deletedSet: Set<string> = new Set();
  try {
    const [cloudProducts, deletedIds] = await Promise.all([
      getFirestoreProducts().catch(() => null),
      getDeletedProductIds().catch(() => new Set<string>())
    ]);

    deletedSet = deletedIds instanceof Set ? deletedIds : new Set<string>();

    if (cloudProducts && Array.isArray(cloudProducts)) {
      // 1. Exclure tout produit cloud qui aurait été marqué supprimé
      const activeCloud = cloudProducts.filter((p: any) => !deletedSet.has(String(p.id)) && !p.isDeleted);

      // 2. Fusionner avec les produits par défaut non présents ET non supprimés
      const existingIds = new Set(cloudProducts.map((p: any) => String(p.id)));
      const missingDefaults = (defaultProducts as any[]).filter(
        dp => !existingIds.has(String(dp.id)) && !deletedSet.has(String(dp.id))
      );
      const combined = [...activeCloud, ...missingDefaults].map(sanitizeProductMedia);

      productsCache = buildCacheEntry(combined, PRODUCTS_TTL_MS);
      return productsCache;
    }
  } catch (error) {
    console.warn("[serverCache] Impossible de charger Firestore, utilisation du catalogue par défaut:", error);
  }

  // Fallback si Firestore indisponible ou vide : exclure systématiquement les produits supprimés
  try {
    if (deletedSet.size === 0) {
      const ids = await getDeletedProductIds().catch(() => new Set<string>());
      deletedSet = ids instanceof Set ? ids : new Set<string>();
    }
  } catch {}

  const fallback = (defaultProducts as any[])
    .filter(dp => !deletedSet.has(String(dp.id)))
    .map(sanitizeProductMedia);
  productsCache = buildCacheEntry(fallback, 60 * 1000);
  return productsCache;
}

/**
 * Récupère le catalogue de produits avec mise en cache mémoire côté serveur.
 */
export async function getCachedProducts(): Promise<any[]> {
  const entry = await loadProductsCacheEntry();
  return entry.data;
}

/**
 * Récupère directement le JSON pré-sérialisé et l'ETag en mémoire vive.
 * Élimine à 100% le goulot d'étranglement de JSON.stringify() sous 1 000 connexions concurrentes.
 */
export async function getCachedProductsJson(): Promise<{ data: any[]; jsonString: string; etag: string }> {
  const entry = await loadProductsCacheEntry();
  return {
    data: entry.data,
    jsonString: entry.jsonString,
    etag: entry.etag,
  };
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
