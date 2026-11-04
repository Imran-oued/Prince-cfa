import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  runTransaction,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase.js";
import { getAdminFirestore, getAdminInitError } from "./firebaseAdmin.ts";

const isProduction = () => process.env.NODE_ENV === "production";

const PRODUCTS_COLLECTION = "products";
const DELETED_PRODUCTS_COLLECTION = "deleted_products";

// Mémoire tampon en environnement de développement ou test (désactivée en production pour garantir la persistance réelle)
const memoryOrders = new Map();
const memoryDeletedProductIds = new Set();

/**
 * Récupérer l'ensemble des identifiants des produits supprimés.
 * Permet d'éviter que les produits par défaut supprimés ne réapparaissent lors des fusions.
 * @returns {Promise<Set<string>>}
 */
export async function getDeletedProductIds() {
  const ids = new Set(memoryDeletedProductIds);

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      const snapshot = await adminDb.collection(DELETED_PRODUCTS_COLLECTION).get();
      snapshot.docs.forEach((docSnap) => ids.add(String(docSnap.id)));
      return ids;
    } catch (error) {
      console.warn("Avertissement Admin Firestore lors de la récupération des produits supprimés:", error);
      return ids;
    }
  }

  if (isFirebaseConfigured()) {
    try {
      const snapshot = await getDocs(collection(db, DELETED_PRODUCTS_COLLECTION));
      snapshot.docs.forEach((docSnap) => ids.add(String(docSnap.id)));
      return ids;
    } catch (error) {
      console.warn("Avertissement lors de la récupération des produits supprimés:", error);
      return ids;
    }
  }

  return ids;
}

/**
 * Récupérer tous les produits depuis Firestore
 * @returns {Promise<any[] | null>}
 */
export async function getProducts() {
  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      const snapshot = await adminDb.collection(PRODUCTS_COLLECTION).get();
      const products = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          ...data,
          id: docSnap.id,
        };
      });
      // Tri en mémoire ultra-rapide et résilient sans dépendance d'index Firestore
      products.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "fr", { sensitivity: "base" }));
      return products;
    } catch (error) {
      console.error("Erreur Admin Firestore lors du chargement des produits:", error);
      return null;
    }
  }

  if (isFirebaseConfigured()) {
    try {
      const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      const products = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
        };
      });
      products.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "fr", { sensitivity: "base" }));
      return products;
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      return null;
    }
  }

  return null;
}

/**
 * Récupérer un seul produit par ID
 * @param {string} id
 * @returns {Promise<any | null>}
 */
export async function getProduct(id) {
  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      const docSnap = await adminDb.collection(PRODUCTS_COLLECTION).doc(id).get();
      if (docSnap.exists) {
        return { ...docSnap.data(), id: docSnap.id };
      }
      return null;
    } catch (error) {
      console.error("Erreur Admin Firestore lors du chargement du produit:", error);
      return null;
    }
  }

  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (typeof docSnap.exists === "function" ? docSnap.exists() : docSnap.exists) {
        return { ...docSnap.data(), id: docSnap.id };
      }
      return null;
    } catch (error) {
      console.error("Erreur lors du chargement du produit:", error);
      return null;
    }
  }

  return null;
}

/**
 * Ajouter un nouveau produit
 */
export async function addProduct(productData) {
  const targetId = productData?.id ? String(productData.id) : null;
  if (targetId) {
    memoryDeletedProductIds.delete(targetId);
  }

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      if (targetId) {
        try {
          await adminDb.collection(DELETED_PRODUCTS_COLLECTION).doc(targetId).delete();
        } catch {}
      }
      const docRef = targetId
        ? adminDb.collection(PRODUCTS_COLLECTION).doc(targetId)
        : adminDb.collection(PRODUCTS_COLLECTION).doc();

      const finalId = docRef.id;
      await docRef.set({
        ...productData,
        id: finalId,
        createdAt: productData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      return finalId;
    } catch (error) {
      console.error("Erreur Admin Firestore lors de l'ajout du produit:", error);
      return null;
    }
  }

  if (targetId && isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, DELETED_PRODUCTS_COLLECTION, targetId));
    } catch {}
  }

  if (isFirebaseConfigured()) {
    try {
      const docRef = targetId
        ? doc(db, PRODUCTS_COLLECTION, targetId)
        : doc(collection(db, PRODUCTS_COLLECTION));

      const finalId = docRef.id;
      await setDoc(docRef, {
        ...productData,
        id: finalId,
        createdAt: productData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      return finalId;
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit:", error);
      return null;
    }
  }

  // Interdiction formelle du fallback factice en production
  if (isProduction()) {
    console.error("[SÉCURITÉ] addProduct refusé : base de données non connectée en production.");
    return null;
  }

  return targetId || null;
}

/**
 * Modifier un produit existant
 */
export async function updateProduct(id, productData) {
  const strId = String(id);
  memoryDeletedProductIds.delete(strId);

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      try {
        await adminDb.collection(DELETED_PRODUCTS_COLLECTION).doc(strId).delete();
      } catch {}

      await adminDb.collection(PRODUCTS_COLLECTION).doc(strId).set({
        ...productData,
        id: strId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      return true;
    } catch (error) {
      console.error("Erreur Admin Firestore lors de la mise à jour du produit:", error);
      return false;
    }
  }

  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, DELETED_PRODUCTS_COLLECTION, strId));
    } catch {}

    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, strId);
      await setDoc(docRef, {
        ...productData,
        id: strId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit:", error);
      return false;
    }
  }

  // Interdiction formelle du fallback factice en production
  if (isProduction()) {
    console.error("[SÉCURITÉ] updateProduct refusé : base de données non connectée en production.");
    return false;
  }

  return true;
}

/**
 * Supprimer un produit définitivement
 * Supprime le document de la collection 'products' ET l'enregistre dans 'deleted_products'
 * pour garantir qu'il ne sera jamais ressuscité par les fallbacks du catalogue statique.
 */
export async function deleteProduct(id) {
  const strId = String(id);
  memoryDeletedProductIds.add(strId);

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      await adminDb.collection(PRODUCTS_COLLECTION).doc(strId).delete();
      await adminDb.collection(DELETED_PRODUCTS_COLLECTION).doc(strId).set({
        id: strId,
        deletedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Erreur Admin Firestore lors de la suppression du produit:", error);
      return false;
    }
  }

  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, strId);
      await deleteDoc(docRef);

      const deletedRef = doc(db, DELETED_PRODUCTS_COLLECTION, strId);
      await setDoc(deletedRef, {
        id: strId,
        deletedAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      return false;
    }
  }

  // Interdiction formelle du fallback factice en production
  if (isProduction()) {
    console.error("[SÉCURITÉ] deleteProduct refusé : base de données non connectée en production.");
    return false;
  }

  return true;
}

/**
 * Synchroniser le catalogue vers Firestore en mode upsert (non destructif).
 * - Ne supprime AUCUN document existant (évite la perte de données en cas d'interruption)
 * - Met à jour ou insère chaque produit avec son ID stable
 */
export async function seedProducts(productsToSync) {
  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      const batch = adminDb.batch();
      for (const product of productsToSync) {
        const { id, ...data } = product;
        const strId = String(id);
        memoryDeletedProductIds.delete(strId);
        const prodRef = adminDb.collection(PRODUCTS_COLLECTION).doc(strId);
        batch.set(prodRef, {
          ...data,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        const delRef = adminDb.collection(DELETED_PRODUCTS_COLLECTION).doc(strId);
        batch.delete(delRef);
      }
      await batch.commit();
      console.log(`✅ ${productsToSync.length} produits synchronisés (Admin SDK batch) dans Firestore.`);
      return true;
    } catch (error) {
      console.error("Erreur Admin Firestore lors de la synchronisation:", error);
      return false;
    }
  }

  if (isFirebaseConfigured()) {
    try {
      for (const product of productsToSync) {
        const { id, ...data } = product;
        const strId = String(id);
        memoryDeletedProductIds.delete(strId);
        await setDoc(doc(db, PRODUCTS_COLLECTION, strId), {
          ...data,
          updatedAt: new Date().toISOString(),
        }, { merge: true });

        try {
          await deleteDoc(doc(db, DELETED_PRODUCTS_COLLECTION, strId));
        } catch {}
      }

      console.log(`✅ ${productsToSync.length} produits synchronisés (upsert sécurisé) dans Firestore.`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la synchronisation Firestore:", error);
      return false;
    }
  }

  return false;
}

// ==========================================
// GESTION DES COMMANDES (COLLECTION "orders")
// ==========================================

export const ORDERS_COLLECTION = "orders";

/**
 * Générer un numéro de commande unique et mémorisable (ex: CMD-20261020-7K9F)
 */
export function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  
  // 4 caractères alphanumériques aléatoires (sans confusion 0/O ou 1/I)
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let randomPart = "";
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `CMD-${year}${month}${day}-${randomPart}`;
}

/**
 * Créer et sceller une nouvelle commande.
 * Le statut initial du paiement est STRICTEMENT 'en_attente'.
 * Aucune validation automatique n'est possible sans intervention admin.
 * @param {Object} orderData
 * @returns {Promise<{ success: boolean, order?: any, error?: string }>}
 */
export async function createOrder(orderData) {
  try {
    const orderId = orderData.id || generateOrderId();
    const createdAt = orderData.createdAt || new Date().toISOString();

    const orderPayload = {
      ...orderData,
      id: orderId,
      createdAt,
      updatedAt: createdAt,
      stockDebited: Boolean(orderData.stockDebited), // false par défaut tant que le paiement n'est pas confirmé
      payment: {
        method: orderData.payment?.method || "orange_money",
        expectedAmount: Number(orderData.payment?.expectedAmount || orderData.pricing?.total || 0),
        merchantNumber: orderData.payment?.merchantNumber || "",
        status: "en_attente", // RÈGLE ABSOLUE : Toujours en attente à la création
        confirmedAt: null,
        confirmedBy: null,
        transactionRef: orderData.payment?.transactionRef || null,
      },
      orderStatus: "en_attente_paiement",
      statusHistory: [
        {
          status: "en_attente_paiement",
          timestamp: createdAt,
          updatedBy: "client",
          note: "Commande initiée par le client"
        }
      ]
    };

    // 1. Sauvegarde dans Firestore si configuré
    const adminDb = getAdminFirestore();
    if (adminDb) {
      await adminDb.collection(ORDERS_COLLECTION).doc(orderId).set(orderPayload);
    } else if (isFirebaseConfigured()) {
      await setDoc(doc(db, ORDERS_COLLECTION, orderId), orderPayload);
    } else if (isProduction()) {
      const initErr = getAdminInitError();
      const reason = initErr ? ` (${initErr})` : "";
      console.error(`[SÉCURITÉ CRITIQUE] createOrder refusé : aucune base de données Firestore configurée en production${reason}. Interdiction formelle du fallback mémoire silencieux.`);
      return { 
        success: false, 
        error: `Service de commande temporairement indisponible (base de données non connectée en production${reason}).` 
      };
    }

    // Sauvegarde en mémoire vive UNIQUEMENT en environnement de test/développement
    if (!isProduction()) {
      memoryOrders.set(orderId, orderPayload);
    }

    // 2. Sauvegarde miroir dans localStorage pour résilience offline/client
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("prince_cfa_orders");
        const orders = saved ? JSON.parse(saved) : [];
        const filtered = orders.filter(o => o.id !== orderId);
        localStorage.setItem("prince_cfa_orders", JSON.stringify([orderPayload, ...filtered]));
      } catch (storageErr) {
        console.warn("Erreur miroir localStorage commande:", storageErr);
      }
    }

    return { success: true, order: orderPayload };
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    return { success: false, error: error.message || "Erreur de création de commande" };
  }
}

/**
 * Récupérer toutes les commandes (Firestore en priorité, sinon localStorage)
 * @returns {Promise<any[]>}
 */
export async function getOrders() {
  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      const snapshot = await adminDb.collection(ORDERS_COLLECTION).orderBy("createdAt", "desc").get();
      const cloudOrders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return cloudOrders;
    } catch (err) {
      console.warn("Erreur chargement Admin Firestore orders:", err);
      if (isProduction()) return [];
    }
  } else if (isFirebaseConfigured()) {
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const cloudOrders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Mettre à jour le cache local
      if (typeof window !== "undefined" && cloudOrders.length > 0) {
        try {
          localStorage.setItem("prince_cfa_orders", JSON.stringify(cloudOrders));
        } catch (e) {
          console.warn("Storage warning:", e);
        }
      }
      return cloudOrders;
    } catch (err) {
      console.warn("Erreur chargement Firestore orders, repli local:", err);
      if (isProduction()) return [];
    }
  }

  // En production, refuser le repli silencieux si la base de données est absente
  if (isProduction()) {
    console.error("[SÉCURITÉ] getOrders : aucune base de données configurée en production.");
    return [];
  }

  // Repli sur le cache local
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("prince_cfa_orders");
      if (saved) return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  if (memoryOrders.size > 0) {
    return Array.from(memoryOrders.values());
  }

  return [];
}

/**
 * Récupérer une commande par son identifiant unique
 * @param {string} orderId
 * @returns {Promise<any | null>}
 */
export async function getOrderById(orderId) {
  if (!orderId) return null;

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      const snap = await adminDb.collection(ORDERS_COLLECTION).doc(orderId).get();
      if (snap.exists) {
        return { id: snap.id, ...snap.data() };
      }
      return null;
    } catch (err) {
      console.warn("Erreur Admin Firestore getOrderById:", err);
      if (isProduction()) return null;
    }
  } else if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, orderId);
      const snap = await getDoc(docRef);
      if (typeof snap.exists === "function" ? snap.exists() : snap.exists) {
        return { id: snap.id, ...snap.data() };
      }
      return null;
    } catch (err) {
      console.warn("Erreur Firestore getOrderById:", err);
      if (isProduction()) return null;
    }
  }

  if (isProduction()) {
    return null;
  }

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("prince_cfa_orders");
      if (saved) {
        const list = JSON.parse(saved);
        const match = list.find(o => o.id === orderId);
        if (match) return match;
      }
    } catch {
      return null;
    }
  }

  if (memoryOrders.has(orderId)) {
    return memoryOrders.get(orderId);
  }

  return null;
}

/**
 * Confirmation MANUELLE d'un paiement par un administrateur autorisé.
 * @param {string} orderId
 * @param {{ confirmedBy: string, transactionRef?: string, note?: string }} adminInfo
 * @returns {Promise<{ success: boolean, order?: any, error?: string }>}
 */
export async function confirmOrderPayment(orderId, { confirmedBy, transactionRef = null, note = "" }) {
  if (!orderId) return { success: false, error: "Identifiant de commande manquant." };
  if (!confirmedBy) return { success: false, error: "Identité de l'administrateur obligatoire." };

  const existing = await getOrderById(orderId);
  if (!existing) return { success: false, error: "Commande introuvable." };

  // DÉBIT DU STOCK : Le stock est décrété et réservé UNIQUEMENT quand l'administrateur valide le paiement
  if (!existing.stockDebited && existing.items && existing.items.length > 0) {
    const stockRes = await checkAndReserveStock(existing.items);
    if (!stockRes.success) {
      return {
        success: false,
        error: `Impossible de confirmer le paiement : ${stockRes.error || "Stock insuffisant en magasin."}`
      };
    }
  }

  const now = new Date().toISOString();
  const updatedOrder = {
    ...existing,
    stockDebited: true,
    updatedAt: now,
    payment: {
      ...existing.payment,
      status: "confirme",
      confirmedAt: now,
      confirmedBy,
      transactionRef: transactionRef || existing.payment?.transactionRef || null,
    },
    orderStatus: existing.orderStatus === "en_attente_paiement" ? "paye_en_preparation" : existing.orderStatus,
    statusHistory: [
      ...(existing.statusHistory || []),
      {
        status: "paiement_confirme",
        timestamp: now,
        updatedBy: confirmedBy,
        note: note || `Paiement vérifié et confirmé manuellement par ${confirmedBy}${transactionRef ? ` (Réf: ${transactionRef})` : ""}. Stock débité avec succès.`
      }
    ]
  };

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      await adminDb.collection(ORDERS_COLLECTION).doc(orderId).set(updatedOrder, { merge: true });
    } catch (err) {
      console.error("Erreur Admin Firestore confirmOrderPayment:", err);
      return { success: false, error: "Échec de sauvegarde Firestore." };
    }
  } else if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, ORDERS_COLLECTION, orderId), updatedOrder, { merge: true });
    } catch (err) {
      console.error("Erreur Firestore confirmOrderPayment:", err);
      return { success: false, error: "Échec de sauvegarde Firestore." };
    }
  } else if (isProduction()) {
    console.error("[SÉCURITÉ] confirmOrderPayment refusé : base de données non connectée en production.");
    return { success: false, error: "Opération impossible : base de données non disponible en production." };
  }

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("prince_cfa_orders");
      const list = saved ? JSON.parse(saved) : [];
      const updatedList = list.map(o => o.id === orderId ? updatedOrder : o);
      localStorage.setItem("prince_cfa_orders", JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }

  if (!isProduction()) {
    memoryOrders.set(orderId, updatedOrder);
  }

  return { success: true, order: updatedOrder };
}

/**
 * Annuler la confirmation d'un paiement précédemment validé.
 * Restitue immédiatement le stock réservé et replace la commande en attente.
 * @param {string} orderId
 * @param {{ adminUser?: string, note?: string }} [options]
 * @returns {Promise<{ success: boolean, order?: any, error?: string }>}
 */
export async function cancelOrderPaymentConfirmation(orderId, { adminUser = "Admin Prince CFA", note = "" } = {}) {
  if (!orderId) return { success: false, error: "Identifiant de commande manquant." };

  const existing = await getOrderById(orderId);
  if (!existing) return { success: false, error: "Commande introuvable." };

  // Restitution immédiate du stock si celui-ci avait été débité
  if (existing.stockDebited && existing.items && existing.items.length > 0) {
    await restoreStock(existing.items);
  }

  const now = new Date().toISOString();
  const updatedOrder = {
    ...existing,
    stockDebited: false,
    updatedAt: now,
    payment: {
      ...existing.payment,
      status: "en_attente",
      confirmedAt: null,
      confirmedBy: null,
    },
    orderStatus: "en_attente_paiement",
    statusHistory: [
      ...(existing.statusHistory || []),
      {
        status: "confirmation_paiement_annulee",
        timestamp: now,
        updatedBy: adminUser,
        note: note || `Confirmation de paiement annulée par l'administrateur (${adminUser}). Stock restitué.`
      }
    ]
  };

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      await adminDb.collection(ORDERS_COLLECTION).doc(orderId).set(updatedOrder, { merge: true });
    } catch (err) {
      console.error("Erreur Admin Firestore cancelOrderPaymentConfirmation:", err);
      return { success: false, error: "Échec de sauvegarde Firestore." };
    }
  } else if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, ORDERS_COLLECTION, orderId), updatedOrder, { merge: true });
    } catch (err) {
      console.error("Erreur Firestore cancelOrderPaymentConfirmation:", err);
      return { success: false, error: "Échec de sauvegarde Firestore." };
    }
  } else if (isProduction()) {
    console.error("[SÉCURITÉ] cancelOrderPaymentConfirmation refusé : base de données non connectée en production.");
    return { success: false, error: "Opération impossible : base de données non disponible en production." };
  }

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("prince_cfa_orders");
      const list = saved ? JSON.parse(saved) : [];
      const updatedList = list.map(o => o.id === orderId ? updatedOrder : o);
      localStorage.setItem("prince_cfa_orders", JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }

  if (!isProduction()) {
    memoryOrders.set(orderId, updatedOrder);
  }

  return { success: true, order: updatedOrder };
}

/**
 * Supprimer définitivement une commande (ex: fausse commande, commande sans paiement).
 * Si le stock avait été débité, il est automatiquement restitué en rayon.
 * @param {string} orderId
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function deleteOrder(orderId) {
  if (!orderId) return { success: false, error: "Identifiant de commande manquant." };

  const existing = await getOrderById(orderId);
  if (existing) {
    if (existing.stockDebited && existing.items && existing.items.length > 0) {
      await restoreStock(existing.items);
    }
  }

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      await adminDb.collection(ORDERS_COLLECTION).doc(orderId).delete();
    } catch (err) {
      console.error("Erreur Admin Firestore deleteOrder:", err);
      return { success: false, error: "Échec de suppression Firestore." };
    }
  } else if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, orderId);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Erreur Firestore deleteOrder:", err);
      return { success: false, error: "Échec de suppression Firestore." };
    }
  } else if (isProduction()) {
    console.error("[SÉCURITÉ] deleteOrder refusé : base de données non connectée en production.");
    return { success: false, error: "Opération impossible : base de données non disponible en production." };
  }

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("prince_cfa_orders");
      if (saved) {
        const list = JSON.parse(saved);
        const filtered = list.filter(o => o.id !== orderId);
        localStorage.setItem("prince_cfa_orders", JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn("Storage warning deleteOrder:", e);
    }
  }

  if (!isProduction()) {
    memoryOrders.delete(orderId);
  }

  return { success: true };
}

/**
 * Mettre à jour le statut d'avancement d'une commande
 * @param {string} orderId
 * @param {'en_attente_paiement' | 'paye_en_preparation' | 'en_livraison' | 'livre' | 'annule'} newStatus
 * @param {string} adminUser
 * @param {string} [note]
 * @returns {Promise<{ success: boolean, order?: any, error?: string }>}
 */
export async function updateOrderStatus(orderId, newStatus, adminUser, note = "") {
  if (!orderId || !newStatus) return { success: false, error: "Paramètres manquants." };

  const existing = await getOrderById(orderId);
  if (!existing) return { success: false, error: "Commande introuvable." };

  // Si annulation et que le stock avait été débité, le restituer
  let shouldUnsetStock = false;
  if (newStatus === "annule" && existing.stockDebited) {
    if (existing.items && existing.items.length > 0) {
      await restoreStock(existing.items);
    }
    shouldUnsetStock = true;
  }

  const now = new Date().toISOString();
  const updatedOrder = {
    ...existing,
    ...(shouldUnsetStock ? { stockDebited: false } : {}),
    orderStatus: newStatus,
    updatedAt: now,
    statusHistory: [
      ...(existing.statusHistory || []),
      {
        status: newStatus,
        timestamp: now,
        updatedBy: adminUser || "admin",
        note: note || `Statut mis à jour vers: ${newStatus}`
      }
    ]
  };

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      await adminDb.collection(ORDERS_COLLECTION).doc(orderId).set(updatedOrder, { merge: true });
    } catch (err) {
      console.error("Erreur Admin Firestore updateOrderStatus:", err);
      return { success: false, error: "Échec de sauvegarde Firestore." };
    }
  } else if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, ORDERS_COLLECTION, orderId), updatedOrder, { merge: true });
    } catch (err) {
      console.error("Erreur Firestore updateOrderStatus:", err);
      return { success: false, error: "Échec de sauvegarde Firestore." };
    }
  } else if (isProduction()) {
    console.error("[SÉCURITÉ] updateOrderStatus refusé : base de données non connectée en production.");
    return { success: false, error: "Opération impossible : base de données non disponible en production." };
  }

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("prince_cfa_orders");
      const list = saved ? JSON.parse(saved) : [];
      const updatedList = list.map(o => o.id === orderId ? updatedOrder : o);
      localStorage.setItem("prince_cfa_orders", JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }

  if (!isProduction()) {
    memoryOrders.set(orderId, updatedOrder);
  }

  return { success: true, order: updatedOrder };
}

/**
 * Mettre à jour le suivi interne sécurisé (IMEI, N° Série, notes SAV).
 * Strictement interne, non exposé au client public ni sur WhatsApp.
 * @param {string} orderId
 * @param {{ imei?: string, serialNumber?: string, internalNote?: string, adminUser?: string }} trackingData
 * @returns {Promise<{ success: boolean, order?: any, error?: string }>}
 */
export async function updateOrderInternalTracking(orderId, trackingData = {}) {
  if (!orderId) return { success: false, error: "Identifiant de commande manquant." };

  const existing = await getOrderById(orderId);
  if (!existing) return { success: false, error: "Commande introuvable." };

  const now = new Date().toISOString();
  const updatedOrder = {
    ...existing,
    updatedAt: now,
    internalTracking: {
      ...(existing.internalTracking || {}),
      imei: trackingData.imei ? String(trackingData.imei).trim() : (existing.internalTracking?.imei || ""),
      serialNumber: trackingData.serialNumber ? String(trackingData.serialNumber).trim() : (existing.internalTracking?.serialNumber || ""),
      internalNote: trackingData.internalNote ? String(trackingData.internalNote).trim() : (existing.internalTracking?.internalNote || ""),
      updatedBy: trackingData.adminUser || "admin",
      updatedAt: now
    }
  };

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      await adminDb.collection(ORDERS_COLLECTION).doc(orderId).set(updatedOrder, { merge: true });
    } catch (err) {
      console.error("Erreur Admin Firestore updateOrderInternalTracking:", err);
      return { success: false, error: "Échec de sauvegarde Firestore." };
    }
  } else if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, ORDERS_COLLECTION, orderId), updatedOrder, { merge: true });
    } catch (err) {
      console.error("Erreur Firestore updateOrderInternalTracking:", err);
      return { success: false, error: "Échec de sauvegarde Firestore." };
    }
  } else if (isProduction()) {
    console.error("[SÉCURITÉ] updateOrderInternalTracking refusé : base de données non connectée en production.");
    return { success: false, error: "Opération impossible : base de données non disponible en production." };
  }

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("prince_cfa_orders");
      const list = saved ? JSON.parse(saved) : [];
      const updatedList = list.map(o => o.id === orderId ? updatedOrder : o);
      localStorage.setItem("prince_cfa_orders", JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }

  if (!isProduction()) {
    memoryOrders.set(orderId, updatedOrder);
  }

  return { success: true, order: updatedOrder };
}

/**
 * Vérification et réservation de stock pour les articles commandés.
 * @param {Array<{ productId: string|number, quantity: number, name: string }>} items
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function checkAndReserveStock(items) {
  if (!items || !items.length) return { success: true };

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      await adminDb.runTransaction(async (transaction) => {
        // Phase 1 : Toutes les lectures transactionnelles
        const updates = [];
        for (const item of items) {
          const prodId = String(item.productId);
          const docRef = adminDb.collection(PRODUCTS_COLLECTION).doc(prodId);
          const snap = await transaction.get(docRef);

          if (snap.exists) {
            const data = snap.data();
            if (data.inStock === false) {
              throw new Error(`Stock insuffisant : le produit "${item.name}" est en rupture de stock.`);
            }
            if (typeof data.stock === "number") {
              if (data.stock < item.quantity) {
                throw new Error(`Stock insuffisant pour "${item.name}". Disponible: ${data.stock}, demandé: ${item.quantity}.`);
              }
              updates.push({
                docRef,
                newStock: data.stock - item.quantity
              });
            }
          }
        }

        // Phase 2 : Toutes les écritures atomiques
        const now = new Date().toISOString();
        for (const u of updates) {
          transaction.update(u.docRef, {
            stock: u.newStock,
            updatedAt: now
          });
        }
      });
      return { success: true };
    } catch (err) {
      if (err.message && (err.message.includes("Stock insuffisant") || err.message.includes("rupture de stock"))) {
        return { success: false, error: err.message };
      }
      console.warn("Avertissement gestion de stock Admin Firestore transactionnelle:", err);
    }
  } else if (isFirebaseConfigured()) {
    try {
      await runTransaction(db, async (transaction) => {
        // Phase 1 : Toutes les lectures doivent être exécutées en premier (règle stricte Firestore)
        const updates = [];
        for (const item of items) {
          const prodId = String(item.productId);
          const docRef = doc(db, PRODUCTS_COLLECTION, prodId);
          const snap = await transaction.get(docRef);

          if (typeof snap.exists === "function" ? snap.exists() : snap.exists) {
            const data = snap.data();
            if (data.inStock === false) {
              throw new Error(`Stock insuffisant : le produit "${item.name}" est en rupture de stock.`);
            }
            if (typeof data.stock === "number") {
              if (data.stock < item.quantity) {
                throw new Error(`Stock insuffisant pour "${item.name}". Disponible: ${data.stock}, demandé: ${item.quantity}.`);
              }
              updates.push({
                docRef,
                newStock: data.stock - item.quantity
              });
            }
          }
        }

        // Phase 2 : Toutes les écritures atomiques
        const now = new Date().toISOString();
        for (const u of updates) {
          transaction.update(u.docRef, {
            stock: u.newStock,
            updatedAt: now
          });
        }
      });
      return { success: true };
    } catch (err) {
      if (err.message && (err.message.includes("Stock insuffisant") || err.message.includes("rupture de stock"))) {
        return { success: false, error: err.message };
      }
      console.warn("Avertissement gestion de stock Firestore transactionnelle:", err);
    }
  }

  return { success: true };
}

/**
 * Libérer / restituer le stock en cas d'annulation de commande.
 * @param {Array<{ productId: string|number, quantity: number }>} items
 */
export async function restoreStock(items) {
  if (!items || !items.length) return;

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      for (const item of items) {
        const prodId = String(item.productId);
        const prodDoc = await getProduct(prodId);
        if (prodDoc && typeof prodDoc.stock === "number") {
          await adminDb.collection(PRODUCTS_COLLECTION).doc(prodId).update({
            stock: prodDoc.stock + item.quantity,
            updatedAt: new Date().toISOString()
          });
        }
      }
      return;
    } catch (err) {
      console.warn("Erreur Admin restitution de stock:", err);
    }
  }

  if (isFirebaseConfigured()) {
    try {
      for (const item of items) {
        const prodId = String(item.productId);
        const prodDoc = await getProduct(prodId);
        if (prodDoc && typeof prodDoc.stock === "number") {
          await updateDoc(doc(db, PRODUCTS_COLLECTION, prodId), {
            stock: prodDoc.stock + item.quantity,
            updatedAt: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.warn("Erreur restitution de stock:", err);
    }
  }
}

/**
 * Contrôler la disponibilité du stock à l'initiation de commande SANS débiter.
 * Vérifie simplement qu'un article n'est pas en rupture officielle.
 * Le débit effectif est réservé à la validation manuelle de l'admin.
 * @param {Array<{ productId: string|number, quantity: number, name: string }>} items
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function checkStockAvailability(items) {
  if (!items || !items.length) return { success: true };

  try {
    for (const item of items) {
      const prodId = String(item.productId);
      const prodDoc = await getProduct(prodId);
      if (prodDoc) {
        if (prodDoc.inStock === false) {
          return {
            success: false,
            error: `Le produit "${item.name}" est actuellement en rupture de stock.`
          };
        }
        if (typeof prodDoc.stock === "number" && prodDoc.stock <= 0) {
          return {
            success: false,
            error: `Le produit "${item.name}" est en rupture de stock.`
          };
        }
      }
    }
  } catch (err) {
    console.warn("Avertissement contrôle disponibilité:", err);
  }

  return { success: true };
}

// Re-exportation des utilitaires d'expiration pour la rétro-compatibilité
export { ORDER_EXPIRATION_HOURS, isOrderExpired } from "./orderUtils.ts";

// --- GESTION DES ABONNEMENTS PUSH NOTIFICATIONS (VAPID / iOS / Android) ---
export const PUSH_SUBSCRIPTIONS_COLLECTION = "push_subscriptions";
const memoryPushSubscriptions = new Map();

function hashEndpoint(endpoint) {
  let hash = 0;
  const str = String(endpoint || "");
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const clean = str.replace(/[^a-zA-Z0-9]/g, "").slice(-30);
  return `sub_${Math.abs(hash).toString(36)}_${clean}`;
}

/**
 * Enregistre ou met à jour l'abonnement push d'un administrateur
 */
export async function savePushSubscription(subscription, userAgent = "") {
  if (!subscription || !subscription.endpoint) return false;
  const docId = hashEndpoint(subscription.endpoint);
  const data = {
    endpoint: subscription.endpoint,
    keys: subscription.keys || {},
    userAgent: String(userAgent || "").slice(0, 200),
    updatedAt: new Date().toISOString()
  };

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      await adminDb.collection(PUSH_SUBSCRIPTIONS_COLLECTION).doc(docId).set(data, { merge: true });
      return true;
    } catch (error) {
      console.warn("Erreur Admin sauvegarde subscription push:", error);
      return false;
    }
  }

  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, PUSH_SUBSCRIPTIONS_COLLECTION, docId);
      await setDoc(docRef, data, { merge: true });
      return true;
    } catch (error) {
      console.warn("Erreur sauvegarde subscription push:", error);
      return false;
    }
  }

  // Interdiction du fallback mémoire silencieux en production
  if (isProduction()) {
    console.error("[SÉCURITÉ] savePushSubscription refusé : base de données non connectée en production.");
    return false;
  }

  memoryPushSubscriptions.set(docId, data);
  return true;
}

/**
 * Récupère tous les abonnements push enregistrés
 */
export async function getPushSubscriptions() {
  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      const snapshot = await adminDb.collection(PUSH_SUBSCRIPTIONS_COLLECTION).get();
      const list = [];
      snapshot.docs.forEach((d) => {
        const data = d.data();
        if (data && data.endpoint) {
          list.push(data);
        }
      });
      return list;
    } catch (error) {
      console.warn("Erreur Admin récupération subscriptions push:", error);
      if (isProduction()) return [];
      return Array.from(memoryPushSubscriptions.values());
    }
  }

  if (isFirebaseConfigured()) {
    try {
      const snapshot = await getDocs(collection(db, PUSH_SUBSCRIPTIONS_COLLECTION));
      const list = [];
      snapshot.docs.forEach((d) => {
        const data = d.data();
        if (data && data.endpoint) {
          list.push(data);
        }
      });
      return list;
    } catch (error) {
      console.warn("Erreur récupération subscriptions push:", error);
      if (isProduction()) return [];
      return Array.from(memoryPushSubscriptions.values());
    }
  }

  if (isProduction()) {
    return [];
  }

  return Array.from(memoryPushSubscriptions.values());
}

/**
 * Supprime un abonnement push expiré ou révoqué
 */
export async function removePushSubscription(endpoint) {
  if (!endpoint) return false;
  const docId = hashEndpoint(endpoint);

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      await adminDb.collection(PUSH_SUBSCRIPTIONS_COLLECTION).doc(docId).delete();
      return true;
    } catch (error) {
      console.warn("Erreur Admin suppression subscription push:", error);
      return false;
    }
  }

  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, PUSH_SUBSCRIPTIONS_COLLECTION, docId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.warn("Erreur suppression subscription push:", error);
      return false;
    }
  }

  if (isProduction()) {
    return false;
  }

  memoryPushSubscriptions.delete(docId);
  return true;
}
