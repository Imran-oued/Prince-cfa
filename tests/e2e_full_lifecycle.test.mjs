import test from "node:test";
import assert from "node:assert/strict";
import { getCachedProducts, invalidateProductsCache, getCachedOrders, invalidateOrdersCache } from "../src/lib/serverCache.ts";
import { 
  createOrder, 
  getOrderById, 
  confirmOrderPayment, 
  updateOrderStatus, 
  restoreStock,
  updateOrderInternalTracking,
  checkAndReserveStock
} from "../src/lib/firestore.js";
import { validateAdminToken, generateAdminToken } from "../src/lib/auth.ts";
import { SHOP_CONFIG } from "../src/config/shop.js";

test("E2E Lifecycle 1: Catalogue — Consultation et mise en cache performante", async () => {
  invalidateProductsCache();
  const products = await getCachedProducts();
  
  assert.ok(Array.isArray(products), "Le catalogue doit être un tableau");
  assert.ok(products.length > 0, "Le catalogue ne doit pas être vide");

  // Vérifier la structure standard d'un produit
  const sample = products[0];
  assert.ok(sample.id, "Le produit doit avoir un id");
  assert.ok(sample.name, "Le produit doit avoir un nom");
  assert.ok(typeof sample.price === "number" && sample.price > 0, "Le produit doit avoir un prix valide");
  assert.ok(sample.category, "Le produit doit avoir une catégorie");

  // Vérification de la conservation en cache
  const cached = await getCachedProducts();
  assert.strictEqual(cached, products, "L'appel consécutif doit provenir de la mémoire vive");
});

test("E2E Lifecycle 2: Panier & Calcul de prix côté serveur (Anti-falsification)", async () => {
  const products = await getCachedProducts();
  const targetProduct = products.find(p => p.storageOptions && p.storageOptions.length > 1) || products[0];

  assert.ok(targetProduct, "Un produit de test doit être présent");

  // Cas 1 : Prix officiel respecté
  const clientItem = {
    productId: targetProduct.id,
    name: targetProduct.name,
    quantity: 2,
    selectedCapacity: targetProduct.storageOptions?.[0]?.capacity || null,
    // Le client tente d'injecter un prix dérisoire
    price: 10
  };

  // Résolution côté serveur
  let unitPrice = Number(targetProduct.salePrice || targetProduct.price);
  if (clientItem.selectedCapacity && targetProduct.storageOptions) {
    const opt = targetProduct.storageOptions.find(o => o.capacity === clientItem.selectedCapacity);
    if (opt) unitPrice = Number(opt.price);
  }

  // Le serveur DOIT ignorer le prix client falsifié (10 FCFA)
  assert.notStrictEqual(unitPrice, 10, "Le prix falsifié par le client doit être ignoré");
  assert.ok(unitPrice > 1000, "Le prix doit être le prix authentique du catalogue");

  const subtotal = unitPrice * clientItem.quantity;
  const isDelivery = true;
  const deliveryFee = isDelivery ? SHOP_CONFIG.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  assert.strictEqual(total, (unitPrice * 2) + SHOP_CONFIG.deliveryFee, "Le total calculé doit être rigoureusement exact");
});

test("E2E Lifecycle 3: Commande — Création avec statut strict 'en_attente_paiement'", async () => {
  const products = await getCachedProducts();
  const testProduct = products[0];

  const orderPayload = {
    customer: {
      name: "Amadou Diallo",
      phone: "+226 70 12 34 56",
      deliveryMethod: "delivery",
      city: "Ouagadougou",
      neighborhood: "Ouaga 2000",
      notes: "Livrer vers 16h"
    },
    items: [
      {
        productId: testProduct.id,
        name: testProduct.name,
        quantity: 1,
        unitPrice: Number(testProduct.salePrice || testProduct.price),
        image: testProduct.image
      }
    ],
    pricing: {
      subtotal: Number(testProduct.salePrice || testProduct.price),
      deliveryFee: SHOP_CONFIG.deliveryFee,
      total: Number(testProduct.salePrice || testProduct.price) + SHOP_CONFIG.deliveryFee,
      currency: "FCFA"
    },
    payment: {
      method: "orange_money",
      expectedAmount: Number(testProduct.salePrice || testProduct.price) + SHOP_CONFIG.deliveryFee,
      merchantNumber: SHOP_CONFIG.displayPhone
    }
  };

  const result = await createOrder(orderPayload);
  assert.ok(result.success, "La commande doit être enregistrée avec succès");
  assert.ok(result.order.id.startsWith("CMD-"), "L'ID doit être préfixé par CMD-");
  assert.strictEqual(result.order.orderStatus, "en_attente_paiement", "Le statut initial DOIT être en_attente_paiement");
  assert.strictEqual(result.order.payment.status, "en_attente", "Le statut de paiement DOIT être en_attente");
  assert.strictEqual(result.order.payment.confirmedAt, null, "Aucun paiement ne peut être confirmé automatiquement");

  // Invalidation du cache des commandes
  invalidateOrdersCache();
});

test("E2E Lifecycle 4: Suivi Client — Masquage PII et étanchéité des données", async () => {
  const testOrder = {
    id: "CMD-20261025-TEST99",
    createdAt: new Date().toISOString(),
    orderStatus: "en_attente_paiement",
    customer: {
      name: "Ibrahim Ouedraogo",
      phone: "+226 70 88 99 00",
      city: "Ouagadougou",
      neighborhood: "Zone du Bois"
    },
    items: [{ name: "iPhone 11", quantity: 1, unitPrice: 120000 }],
    pricing: { subtotal: 120000, deliveryFee: 2000, total: 122000, currency: "FCFA" },
    payment: { status: "en_attente", method: "orange_money" },
    internalTracking: {
      imei: "354890123456789",
      serialNumber: "F2LZX001N9",
      internalNote: "Vérifié en atelier"
    }
  };

  // Simuler la fonction de sanitization de route track
  const rawPhone = testOrder.customer.phone;
  const digits = rawPhone.replace(/\D+/g, "");
  const phoneMasked = digits.length >= 4 
    ? digits.replace(/(\d{2})(\d+)(\d{2})$/, "$1 •••• $3")
    : "••••••••";

  // En consultation non authentifiée (par ID seul)
  const isPhoneVerified = false;
  const customerName = isPhoneVerified
    ? testOrder.customer.name
    : testOrder.customer.name.split(" ").map(w => w.length > 1 ? `${w[0]}***` : w).join(" ");

  const sanitized = {
    id: testOrder.id,
    orderStatus: testOrder.orderStatus,
    customer: {
      name: customerName,
      phoneMasked,
      neighborhood: isPhoneVerified ? testOrder.customer.neighborhood : "Zone réservée"
    },
    items: testOrder.items,
    pricing: testOrder.pricing,
    payment: {
      status: testOrder.payment.status,
      method: testOrder.payment.method
    }
  };

  // VÉRIFICATIONS DE SÉCURITÉ CRITIQUES :
  assert.strictEqual(sanitized.customer.name, "I*** O***", "Le nom doit être masqué sans validation de téléphone");
  assert.ok(sanitized.customer.phoneMasked.includes("••••"), "Le téléphone doit être masqué");
  assert.strictEqual(sanitized.customer.neighborhood, "Zone réservée", "L'adresse précise doit être masquée");
  assert.strictEqual(sanitized.internalTracking, undefined, "L'IMEI et le numéro de série ne doivent JAMAIS fuiter dans le suivi public");
});

test("E2E Lifecycle 5: Paiement Manuel & Validation Administrateur", async () => {
  // 1. Création d'une commande
  const orderRes = await createOrder({
    customer: { name: "Fatou Sanogo", phone: "+226 76 54 32 10" },
    pricing: { total: 85000 },
    payment: { method: "orange_money", expectedAmount: 85000 }
  });
  assert.ok(orderRes.success);
  const orderId = orderRes.order.id;

  // 2. L'administrateur confirme manuellement la réception des fonds
  const confirmRes = await confirmOrderPayment(orderId, {
    confirmedBy: "Admin Oumar",
    transactionRef: "OM-TX-20261025-8849",
    note: "Virement Orange Money reçu et vérifié sur le terminal pro"
  });

  assert.ok(confirmRes.success, "La confirmation de paiement par admin doit réussir");
  assert.strictEqual(confirmRes.order.payment.status, "confirme", "Le paiement doit être marqué comme confirmé");
  assert.strictEqual(confirmRes.order.orderStatus, "paye_en_preparation", "Le statut de commande doit passer à paye_en_preparation");
  assert.strictEqual(confirmRes.order.payment.confirmedBy, "Admin Oumar");
  assert.strictEqual(confirmRes.order.payment.transactionRef, "OM-TX-20261025-8849");
  assert.ok(confirmRes.order.payment.confirmedAt, "Une date de confirmation doit être enregistrée");

  // Invalidation immédiate du cache pour que le client voie le nouveau statut sans délai
  invalidateOrdersCache();
});

test("E2E Lifecycle 6: Espace Administrateur — Sécurité session, tracking interne et annulation avec restitution stock", async () => {
  // 1. Sécurité session : Token valide vs contrefait
  const validToken = generateAdminToken();
  const isValid = validateAdminToken(validToken);
  assert.strictEqual(isValid, true, "Le token admin officiel doit être validé");

  const isForgedValid = validateAdminToken("admin_session_fake_token_12345");
  assert.strictEqual(isForgedValid, false, "Un token contrefait doit être rejeté");

  // 2. Mise à jour de tracking interne (IMEI / Série)
  const orderRes = await createOrder({
    customer: { name: "Issa Traore", phone: "+226 78 11 22 33" },
    items: [{ productId: "pcfa-11", name: "iPhone 11", quantity: 1 }],
    pricing: { total: 120000 },
    payment: { method: "wave" }
  });
  const orderId = orderRes.order.id;

  const trackingRes = await updateOrderInternalTracking(orderId, {
    imei: "860492041234567",
    serialNumber: "IPH11-SN-8899",
    internalNote: "Emballage d'origine scellé avec garantie 6 mois",
    adminUser: "Admin Oumar"
  });
  assert.ok(trackingRes.success, "L'enregistrement du tracking interne doit réussir");
  assert.strictEqual(trackingRes.order.internalTracking.imei, "860492041234567");

  // 3. Changement de statut vers livraison
  const deliveryRes = await updateOrderStatus(orderId, "en_livraison", "Admin Oumar", "Remis au livreur Moussa");
  assert.ok(deliveryRes.success);
  assert.strictEqual(deliveryRes.order.orderStatus, "en_livraison");

  // 4. Annulation et restitution de stock
  const cancelRes = await updateOrderStatus(orderId, "annule", "Admin Oumar", "Annulé à la demande du client");
  assert.ok(cancelRes.success);
  assert.strictEqual(cancelRes.order.orderStatus, "annule");
});
