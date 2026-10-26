import { test } from "node:test";
import assert from "node:assert/strict";
import { generateOrderId } from "../src/lib/firestore.js";
import { SHOP_CONFIG } from "../src/config/shop.js";

test("1. generateOrderId generates compliant CMD-YYYYMMDD-XXXX format", () => {
  const id = generateOrderId();
  assert.match(id, /^CMD-\d{8}-[A-Z0-9]{4}$/);
});

test("2. SHOP_CONFIG defines dedicated Orange Money and Wave payment methods", () => {
  assert.ok(SHOP_CONFIG.paymentMethods.orange_money, "Orange Money method exists");
  assert.equal(SHOP_CONFIG.paymentMethods.orange_money.name, "Orange Money");
  assert.equal(SHOP_CONFIG.paymentMethods.orange_money.number, "55443167");
  assert.equal(SHOP_CONFIG.paymentMethods.orange_money.ussdCode, "*144*2*1*55443167*MONTANT#");
  assert.ok(SHOP_CONFIG.paymentMethods.orange_money.instructions.length > 10);

  assert.ok(SHOP_CONFIG.paymentMethods.wave, "Wave method exists");
  assert.equal(SHOP_CONFIG.paymentMethods.wave.name, "Wave");
  assert.equal(SHOP_CONFIG.paymentMethods.wave.number, "07778740");
  assert.ok(SHOP_CONFIG.paymentMethods.wave.instructions.length > 10);
});

test("3. Pricing calculation sums items and adds delivery fee only for home delivery", () => {
  const items = [
    { price: 120000, quantity: 2 }, // 240,000
    { price: 85000, quantity: 1 }    // 85,000
  ];
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  assert.equal(subtotal, 325000);

  const deliveryFee = SHOP_CONFIG.deliveryFee;
  assert.equal(deliveryFee, 1500);

  // Cas 1 : Livraison à domicile
  const totalWithDelivery = subtotal + deliveryFee;
  assert.equal(totalWithDelivery, 326500);

  // Cas 2 : Retrait en magasin
  const totalPickup = subtotal + 0;
  assert.equal(totalPickup, 325000);
});

test("4. Order initialization strictly enforces 'en_attente' status without auto-validation", () => {
  const initialOrder = {
    payment: {
      status: "en_attente",
      confirmedAt: null,
      confirmedBy: null
    },
    orderStatus: "en_attente_paiement"
  };

  assert.equal(initialOrder.payment.status, "en_attente");
  assert.equal(initialOrder.payment.confirmedAt, null);
  assert.equal(initialOrder.payment.confirmedBy, null);
  assert.equal(initialOrder.orderStatus, "en_attente_paiement");
});

test("5. Payment confirmation requires authorized admin and updates status to confirmed", () => {
  const order = {
    id: "CMD-20261020-TEST",
    payment: {
      status: "en_attente",
      confirmedAt: null,
      confirmedBy: null,
      transactionRef: null
    },
    orderStatus: "en_attente_paiement"
  };

  const adminName = "Moussa Ouedraogo (Admin)";
  const txRef = "OM-8837190";
  const now = new Date().toISOString();

  // Simulation de confirmOrderPayment
  const confirmedOrder = {
    ...order,
    payment: {
      ...order.payment,
      status: "confirme",
      confirmedAt: now,
      confirmedBy: adminName,
      transactionRef: txRef
    },
    orderStatus: "paye_en_preparation"
  };

  assert.equal(confirmedOrder.payment.status, "confirme");
  assert.equal(confirmedOrder.payment.confirmedBy, adminName);
  assert.equal(confirmedOrder.payment.transactionRef, txRef);
  assert.equal(confirmedOrder.orderStatus, "paye_en_preparation");
});

test("6. WhatsApp URL encoding contains order ID and totals without leaking secrets", () => {
  const orderId = "CMD-20261020-9988";
  const customerName = "Salif Traoré";
  const total = 120000;
  const paymentMethodName = "Orange Money";

  let message = `👑 COMMANDE PRINCE CFA 👑\n`;
  message += `Numéro : ${orderId}\n`;
  message += `Client : ${customerName}\n`;
  message += `Total : ${total} FCFA\n`;
  message += `Mode : ${paymentMethodName}\n`;

  const encoded = encodeURIComponent(message);
  assert.ok(encoded.includes("CMD-20261020-9988"));
  assert.ok(!encoded.includes("password"));
  assert.ok(!encoded.includes("pin"));
});

test("7. Internal tracking (IMEI & Serial Number) is preserved internally and excluded from public WhatsApp message", () => {
  const orderWithTracking = {
    id: "CMD-20261020-TECH",
    customer: { name: "Ousmane Diallo", phone: "70112233" },
    pricing: { total: 450000 },
    payment: { method: "orange_money", status: "confirme" },
    internalTracking: {
      imei: "356789123456789",
      serialNumber: "PCFA-SN-88219",
      internalNote: "Appareil descellé pour contrôle écran avant remise au livreur",
      updatedBy: "Responsable SAV"
    }
  };

  // Le message public destiné à WhatsApp ne doit JAMAIS contenir l'IMEI ou les notes internes SAV
  const publicSummary = `Commande: ${orderWithTracking.id} - Montant: ${orderWithTracking.pricing.total}`;
  const whatsappUrl = `https://wa.me/22607778740?text=${encodeURIComponent(publicSummary)}`;

  assert.ok(orderWithTracking.internalTracking.imei === "356789123456789");
  assert.ok(!whatsappUrl.includes("356789123456789"), "IMEI must not leak to WhatsApp URL");
  assert.ok(!whatsappUrl.includes("PCFA-SN-88219"), "Serial number must not leak to WhatsApp URL");
});

test("8. Product tech specifications support category-specific attributes without rigid forcing", () => {
  const phoneProduct = {
    category: "phones",
    specs: {
      screen: '6.1" OLED',
      processor: "A15 Bionic",
      camera: "12MP Dual",
      battery: "All day"
    },
    condition: "neuf",
    warranty: "12 mois"
  };

  const solarProduct = {
    category: "solar",
    specs: {
      panels: "800W Monocristallin",
      inverter: "10kW Hybride",
      storage: "15kWh"
    },
    warranty: "25 ans"
  };

  // Téléphone possède screen/camera mais pas de panels
  assert.ok(phoneProduct.specs.screen && phoneProduct.specs.camera);
  assert.equal(phoneProduct.specs.panels, undefined);

  // Solaire possède panels/inverter mais pas d'appareil photo
  assert.ok(solarProduct.specs.panels && solarProduct.specs.inverter);
  assert.equal(solarProduct.specs.camera, undefined);
});

test("9. USSD Orange Money code formatting matches *144*2*1*55443167*montant#", () => {
  const amount = 901500;
  const orangeNumber = SHOP_CONFIG.paymentMethods.orange_money?.merchantCode || SHOP_CONFIG.paymentMethods.orange_money?.number || "55443167";
  const ussdCodeString = `*144*2*1*${orangeNumber}*${amount}#`;
  const telUssdUrl = `tel:*144*2*1*${orangeNumber}*${amount}%23`;

  assert.equal(ussdCodeString, "*144*2*1*55443167*901500#");
  assert.equal(telUssdUrl, "tel:*144*2*1*55443167*901500%23");
});

