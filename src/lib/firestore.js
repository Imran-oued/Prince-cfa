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
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase.js";

const PRODUCTS_COLLECTION = "products";

// Mémoire tampon en environnement serveur/test lorsque Firebase n'est pas configuré
const memoryOrders = new Map();

/**
 * Récupérer tous les produits depuis Firestore
 * @returns {Promise<any[] | null>}
 */
export async function getProducts() {
  if (!isFirebaseConfigured()) return null;

  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy("name", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erreur lors du chargement des produits:", error);
    return null;
  }
}

/**
 * Récupérer un seul produit par ID
 * @param {string} id
 * @returns {Promise<any | null>}
 */
export async function getProduct(id) {
  if (!isFirebaseConfigured()) return null;

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Erreur lors du chargement du produit:", error);
    return null;
  }
}

/**
 * Ajouter un nouveau produit
 */
export async function addProduct(productData) {
  if (!isFirebaseConfigured()) return null;

  try {
    const docRef = await addDoc(
      collection(db, PRODUCTS_COLLECTION),
      {
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error);
    return null;
  }
}

/**
 * Modifier un produit existant
 */
export async function updateProduct(id, productData) {
  if (!isFirebaseConfigured()) return false;

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    return false;
  }
}

/**
 * Supprimer un produit
 */
export async function deleteProduct(id) {
  if (!isFirebaseConfigured()) return false;

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    return false;
  }
}

/**
 * Synchroniser le catalogue vers Firestore en mode upsert (non destructif).
 * - Ne supprime AUCUN document existant (évite la perte de données en cas d'interruption)
 * - Met à jour ou insère chaque produit avec son ID stable
 */
export async function seedProducts(productsToSync) {
  if (!isFirebaseConfigured()) return false;

  try {
    for (const product of productsToSync) {
      const { id, ...data } = product;
      await setDoc(doc(db, PRODUCTS_COLLECTION, String(id)), {
        ...data,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }

    console.log(`✅ ${productsToSync.length} produits synchronisés (upsert sécurisé) dans Firestore.`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la synchronisation Firestore:", error);
    return false;
  }
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
    if (isFirebaseConfigured()) {
      await setDoc(doc(db, ORDERS_COLLECTION, orderId), orderPayload);
    }

    // Sauvegarde en mémoire vive pour le serveur de test/développement
    memoryOrders.set(orderId, orderPayload);

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
  if (isFirebaseConfigured()) {
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
    }
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

  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, orderId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
    } catch (err) {
      console.warn("Erreur Firestore getOrderById:", err);
    }
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

  const now = new Date().toISOString();
  const updatedOrder = {
    ...existing,
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
        note: note || `Paiement vérifié et confirmé manuellement par ${confirmedBy}${transactionRef ? ` (Réf: ${transactionRef})` : ""}`
      }
    ]
  };

  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, ORDERS_COLLECTION, orderId), updatedOrder, { merge: true });
    } catch (err) {
      console.error("Erreur Firestore confirmOrderPayment:", err);
      return { success: false, error: "Échec de sauvegarde Firestore." };
    }
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

  memoryOrders.set(orderId, updatedOrder);

  return { success: true, order: updatedOrder };
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

  const now = new Date().toISOString();
  const updatedOrder = {
    ...existing,
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

  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, ORDERS_COLLECTION, orderId), updatedOrder, { merge: true });
    } catch (err) {
      console.error("Erreur Firestore updateOrderStatus:", err);
      return { success: false, error: "Échec de sauvegarde Firestore." };
    }
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

  memoryOrders.set(orderId, updatedOrder);

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

  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, ORDERS_COLLECTION, orderId), updatedOrder, { merge: true });
    } catch (err) {
      console.error("Erreur Firestore updateOrderInternalTracking:", err);
      return { success: false, error: "Échec de sauvegarde Firestore." };
    }
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

  memoryOrders.set(orderId, updatedOrder);

  return { success: true, order: updatedOrder };
}

/**
 * Vérification et réservation de stock pour les articles commandés.
 * @param {Array<{ productId: string|number, quantity: number, name: string }>} items
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function checkAndReserveStock(items) {
  if (!items || !items.length) return { success: true };

  // Si Firestore est configuré, on vérifie et décrémente
  if (isFirebaseConfigured()) {
    try {
      for (const item of items) {
        const prodId = String(item.productId);
        const prodDoc = await getProduct(prodId);
        if (prodDoc) {
          if (prodDoc.inStock === false) {
            return {
              success: false,
              error: `Stock insuffisant : le produit "${item.name}" est en rupture de stock.`
            };
          }
          if (typeof prodDoc.stock === "number") {
            if (prodDoc.stock < item.quantity) {
              return {
                success: false,
                error: `Stock insuffisant pour "${item.name}". Disponible: ${prodDoc.stock}, demandé: ${item.quantity}.`
              };
            }
            // Décrémenter le stock
            await updateDoc(doc(db, PRODUCTS_COLLECTION, prodId), {
              stock: prodDoc.stock - item.quantity,
              updatedAt: new Date().toISOString()
            });
          }
        }
      }
    } catch (err) {
      console.warn("Avertissement gestion de stock Firestore:", err);
    }
  }

  return { success: true };
}

/**
 * Libérer / restituer le stock en cas d'annulation de commande.
 * @param {Array<{ productId: string|number, quantity: number }>} items
 */
export async function restoreStock(items) {
  if (!items || !items.length || !isFirebaseConfigured()) return;

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
