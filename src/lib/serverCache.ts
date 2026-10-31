import { getProducts as getFirestoreProducts, getOrders as getFirestoreOrders, getDeletedProductIds } from "./firestore.js";
import { products as defaultProducts } from "../data/products.js";
import { isAppleBrand } from "./productValidation.ts";

// Cache mémoire serveur pour les produits du catalogue
interface ProductsCacheEntry {
  data: any[];
  jsonString: string;
  etag: string;
  expiresAt: number;
}

let productsCache: ProductsCacheEntry | null = null;
const PRODUCTS_TTL_MS = 30 * 1000; // 30 secondes pour une fraîcheur maximale (réactivité instantanée pour l'admin)

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
  if (!product || typeof product !== "object" || !product.id || !product.name || typeof product.price !== "number") {
    return null;
  }
  let image = product.image;
  let images = Array.isArray(product.images) ? [...product.images] : [];
  let modified = false;

  // Dictionnaire des produits avec images statiques pré-extraites dans public/products/accessories
  const staticAccessoryFiles: Record<string, { image: string; images?: string[] }> = {
    "p-1793436636409": { image: "/products/accessories/p-1793436636409.jpg", images: ["/products/accessories/p-1793436636409.jpg"] },
    "p-1793438013744": { image: "/products/accessories/p-1793438013744.jpg", images: ["/products/accessories/p-1793438013744.jpg"] },
    "p-1793438552357": { image: "/products/accessories/p-1793438552357.jpg", images: ["/products/accessories/p-1793438552357.jpg"] },
    "p-1793451231100": { image: "/products/accessories/p-1793451231100.jpg", images: ["/products/accessories/p-1793451231100.jpg"] },
    "p-1793451514805": { image: "/products/accessories/p-1793451514805.jpg", images: ["/products/accessories/p-1793451514805.jpg"] },
    "p-1793451797408": { image: "/products/accessories/p-1793451797408.jpg", images: ["/products/accessories/p-1793451797408.jpg"] },
    "p-1793452645875": { image: "/products/accessories/p-1793452645875.jpg", images: ["/products/accessories/p-1793452645875.jpg"] },
    "p-1793452841657": { image: "/products/accessories/p-1793452841657.jpg", images: ["/products/accessories/p-1793452841657.jpg"] },
    "p-1793453107207": { image: "/products/accessories/p-1793453107207.jpg", images: ["/products/accessories/p-1793453107207.jpg"] },
    "p-1793453840425": { image: "/products/accessories/p-1793453840425.jpg", images: ["/products/accessories/p-1793453840425.jpg"] },
    "p-1793454132122": { image: "/products/accessories/p-1793454132122.jpg", images: ["/products/accessories/p-1793454132122.jpg"] },
    "p-1793464524867": { image: "/products/accessories/p-1793464524867.jpg", images: ["/products/accessories/p-1793464524867.jpg", "/products/accessories/p-1793464524867-2.jpg"] },
  };

  const staticConfig = staticAccessoryFiles[String(product.id)];
  if (staticConfig) {
    if (typeof image === "string" && image.startsWith("data:image/")) {
      image = staticConfig.image;
      modified = true;
    }
    if (Array.isArray(images) && images.length > 0 && staticConfig.images) {
      images = staticConfig.images;
      modified = true;
    }
  } else if (product.id === "UOGdbGVosnh6CovWNOkD") {
    if (typeof image === "string" && image.startsWith("data:image/")) {
      image = "/products/mobility/moto-electrique-1.jpg";
      modified = true;
    }
    if (Array.isArray(images) && images.length > 0) {
      images = images.map((img: any, idx: number) => {
        if (typeof img === "string" && img.startsWith("data:image/")) {
          modified = true;
          return idx === 1 ? "/products/mobility/moto-electrique-2.jpg" : "/products/mobility/moto-electrique-1.jpg";
        }
        return img;
      });
    }
  }

  // Mode Autres Marques (Android) : aucun choix de couleur ni format de SIM (suppression systématique même pour l'existant)
  const isAndroidPhone = (product.category === "phones" || !product.category) &&
    !isAppleBrand(product.brand) &&
    !Boolean(product.name && String(product.name).toLowerCase().includes("iphone"));

  const colors = isAndroidPhone ? [] : (Array.isArray(product.colors) ? product.colors : []);

  const cleaned = {
    ...product,
    image,
    images,
    colors,
  };

  if (isAndroidPhone) {
    delete cleaned.simPricing;
    delete cleaned.selectedSimType;
    if (cleaned.specs) {
      const sp = { ...cleaned.specs };
      delete sp.simFormat;
      delete sp.sim;
      cleaned.specs = sp;
    }
  }

  return cleaned;
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
      const combined = [...activeCloud, ...missingDefaults]
        .map(sanitizeProductMedia)
        .filter(Boolean);

      // Déduplication stricte par ID pour garantir l'absence totale de doublons
      const uniqueMap = new Map();
      for (const p of combined) {
        const idKey = String(p.id);
        if (!uniqueMap.has(idKey)) {
          uniqueMap.set(idKey, p);
        }
      }
      const deduplicated = Array.from(uniqueMap.values());

      productsCache = buildCacheEntry(deduplicated, PRODUCTS_TTL_MS);
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
    .map(sanitizeProductMedia)
    .filter(Boolean);
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
