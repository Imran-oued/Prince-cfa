import test from "node:test";
import assert from "node:assert/strict";
import { 
  createOrder, 
  getOrderById, 
  confirmOrderPayment, 
  cancelOrderPaymentConfirmation,
  deleteOrder,
  updateOrderStatus,
  checkStockAvailability 
} from "../src/lib/firestore.js";

test("Stock Lifecycle 1: La création de commande ne débite PAS le stock (stockDebited = false)", async () => {
  const orderRes = await createOrder({
    customer: { name: "Client Test Sans Paiement", phone: "+226 70 00 00 01" },
    items: [{ productId: "pcfa-iphone13", name: "iPhone 13", quantity: 1, unitPrice: 250000 }],
    pricing: { subtotal: 250000, total: 250000 },
    payment: { method: "orange_money" }
  });

  assert.ok(orderRes.success);
  const order = orderRes.order;
  assert.strictEqual(order.stockDebited, false, "Le stock ne doit PAS être débité à la création de commande");
  assert.strictEqual(order.payment.status, "en_attente", "Le paiement doit être strictement en attente");
  assert.strictEqual(order.orderStatus, "en_attente_paiement");
});

test("Stock Lifecycle 2: Le stock est débité UNIQUEMENT quand l'admin confirme le paiement", async () => {
  const orderRes = await createOrder({
    customer: { name: "Client Paiement Validé", phone: "+226 70 00 00 02" },
    items: [{ productId: "pcfa-macbook", name: "MacBook Pro", quantity: 1, unitPrice: 850000 }],
    pricing: { subtotal: 850000, total: 850000 },
    payment: { method: "orange_money" }
  });
  const orderId = orderRes.order.id;

  // L'administrateur confirme le paiement
  const confirmRes = await confirmOrderPayment(orderId, {
    confirmedBy: "Admin Prince CFA",
    transactionRef: "OM-998877",
    note: "Reçu vérifié"
  });

  assert.ok(confirmRes.success);
  assert.strictEqual(confirmRes.order.stockDebited, true, "Le stock doit être marqué comme débité après confirmation");
  assert.strictEqual(confirmRes.order.payment.status, "confirme");
  assert.strictEqual(confirmRes.order.payment.confirmedBy, "Admin Prince CFA");
  assert.strictEqual(confirmRes.order.orderStatus, "paye_en_preparation");
});

test("Stock Lifecycle 3: L'admin peut annuler une confirmation de paiement et restituer le stock", async () => {
  const orderRes = await createOrder({
    customer: { name: "Client Paiement Annulé", phone: "+226 70 00 00 03" },
    items: [{ productId: "pcfa-rog", name: "Asus ROG", quantity: 1, unitPrice: 900000 }],
    pricing: { subtotal: 900000, total: 900000 },
    payment: { method: "orange_money" }
  });
  const orderId = orderRes.order.id;

  // 1. Confirmer paiement
  await confirmOrderPayment(orderId, { confirmedBy: "Admin" });
  const confirmed = await getOrderById(orderId);
  assert.strictEqual(confirmed.payment.status, "confirme");
  assert.strictEqual(confirmed.stockDebited, true);

  // 2. Annuler la confirmation de paiement
  const cancelRes = await cancelOrderPaymentConfirmation(orderId, {
    adminUser: "Admin Gérant",
    note: "Paiement non reçu / faux SMS"
  });

  assert.ok(cancelRes.success);
  assert.strictEqual(cancelRes.order.stockDebited, false, "Le stock doit être libéré (stockDebited: false)");
  assert.strictEqual(cancelRes.order.payment.status, "en_attente", "Le statut de paiement doit redevenir 'en_attente'");
  assert.strictEqual(cancelRes.order.payment.confirmedAt, null);
  assert.strictEqual(cancelRes.order.payment.confirmedBy, null);
  assert.strictEqual(cancelRes.order.orderStatus, "en_attente_paiement");
});

test("Stock Lifecycle 4: Annulation d'une commande non payée ne restitue pas de faux stock", async () => {
  const orderRes = await createOrder({
    customer: { name: "Client Jamais Payé", phone: "+226 70 00 00 04" },
    items: [{ productId: "pcfa-ps5", name: "PS5 Pro", quantity: 1, unitPrice: 500000 }],
    pricing: { subtotal: 500000, total: 500000 },
    payment: { method: "orange_money" }
  });
  const orderId = orderRes.order.id;
  assert.strictEqual(orderRes.order.stockDebited, false);

  // Annuler la commande directement sans qu'elle ait été payée
  const cancelOrderRes = await updateOrderStatus(orderId, "annule", "Admin", "Commande abandonnée");
  assert.ok(cancelOrderRes.success);
  assert.strictEqual(cancelOrderRes.order.orderStatus, "annule");
  assert.strictEqual(cancelOrderRes.order.stockDebited, false, "stockDebited reste false sans double restitution");
});

test("Stock Lifecycle 5: Suppression définitive d'une commande sans paiement ou d'une fausse commande", async () => {
  const orderRes = await createOrder({
    customer: { name: "Client Faux Spam", phone: "+226 70 99 99 99" },
    items: [{ productId: "pcfa-watch", name: "Apple Watch", quantity: 1, unitPrice: 150000 }],
    pricing: { subtotal: 150000, total: 150000 },
    payment: { method: "orange_money" }
  });
  const orderId = orderRes.order.id;

  const foundBefore = await getOrderById(orderId);
  assert.ok(foundBefore, "La commande existe avant suppression");

  // Suppression par l'admin
  const deleteRes = await deleteOrder(orderId);
  assert.ok(deleteRes.success, "La suppression doit réussir");

  const foundAfter = await getOrderById(orderId);
  assert.strictEqual(foundAfter, null, "La commande doit être introuvable après suppression");
});

test("Stock Lifecycle 6: checkStockAvailability vérifie sans bloquer les commandes normales", async () => {
  const availability = await checkStockAvailability([
    { productId: "pcfa-11", name: "iPhone 11", quantity: 1 }
  ]);
  assert.strictEqual(availability.success, true);
});
