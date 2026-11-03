import { test } from "node:test";
import assert from "node:assert/strict";
import { isAdminConfigured } from "../src/lib/firebaseAdmin.ts";
import { 
  createOrder, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  confirmOrderPayment 
} from "../src/lib/firestore.js";
import { 
  verifyAdminPassword, 
  generateAdminToken, 
  validateAdminToken, 
  verifyAdminAuth,
  getAuthSecret
} from "../src/lib/auth.ts";
import { checkRateLimit } from "../src/lib/rateLimit.ts";
import { VAPID_CONFIG } from "../src/config/vapid.ts";

test("Sec-PreProd 1: isAdminConfigured strictly validates credentials", () => {
  const originalKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const originalEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const originalPrivKey = process.env.FIREBASE_PRIVATE_KEY;

  try {
    delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.FIREBASE_PRIVATE_KEY;
    assert.equal(isAdminConfigured(), false, "Must be false when no vars are set");

    // Partial vars (email without private key)
    process.env.FIREBASE_CLIENT_EMAIL = "test@project.iam.gserviceaccount.com";
    assert.equal(isAdminConfigured(), false, "Must be false if private key is missing");

    // Both email and private key set
    process.env.FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIE...";
    assert.equal(isAdminConfigured(), true, "Must be true when both email and private key are set");

    // Service account JSON provided
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.FIREBASE_PRIVATE_KEY;
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY = '{"project_id":"prince-cfa"}';
    assert.equal(isAdminConfigured(), true, "Must be true when service account JSON is set");
  } finally {
    if (originalKey) process.env.FIREBASE_SERVICE_ACCOUNT_KEY = originalKey;
    else delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (originalEmail) process.env.FIREBASE_CLIENT_EMAIL = originalEmail;
    else delete process.env.FIREBASE_CLIENT_EMAIL;
    if (originalPrivKey) process.env.FIREBASE_PRIVATE_KEY = originalPrivKey;
    else delete process.env.FIREBASE_PRIVATE_KEY;
  }
});

test("Sec-PreProd 2: In production mode, silent memory fallback is strictly blocked", async () => {
  const originalEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = "production";

    // En production sans Firebase Admin configuré :
    // 1. createOrder doit refuser d'enregistrer silencieusement en mémoire
    const orderRes = await createOrder({
      customer: { name: "Client Test Prod", phone: "+226 70 00 00 99" },
      items: [{ productId: "test", name: "Produit Test", quantity: 1, unitPrice: 10000 }],
      pricing: { total: 10000 }
    });
    assert.equal(orderRes.success, false, "Must fail in production without connected DB");
    assert.match(orderRes.error, /indisponible|base de données/i);

    // 2. Mutations produit doivent échouer au lieu de prétendre le succès
    const addRes = await addProduct({ name: "Produit Fake Prod", price: 10000 });
    assert.equal(addRes, null, "addProduct must return null in production if DB unconfigured");

    const updateRes = await updateProduct("some-id", { name: "Updated Prod" });
    assert.equal(updateRes, false, "updateProduct must return false in production if DB unconfigured");

    const deleteRes = await deleteProduct("some-id");
    assert.equal(deleteRes, false, "deleteProduct must return false in production if DB unconfigured");

    const confirmRes = await confirmOrderPayment("CMD-FAKE", { confirmedBy: "Admin" });
    assert.equal(confirmRes.success, false, "confirmOrderPayment must return false in production if DB unconfigured");

  } finally {
    process.env.NODE_ENV = originalEnv;
  }
});

test("Sec-PreProd 3: Admin authentication enforcement and token tampering rejection", async () => {
  // Jeton légitime
  const validToken = generateAdminToken();
  assert.equal(validateAdminToken(validToken), true, "Legitimate token is valid");

  // Rejet des jetons altérés
  assert.equal(validateAdminToken(""), false);
  assert.equal(validateAdminToken("Bearer null"), false);
  assert.equal(validateAdminToken("adm.1234.5678"), false);
  assert.equal(validateAdminToken("adm.1234.5678.invalidsignature"), false);

  // Vérification de requête HTTP non autorisée
  const unauthReq = new Request("https://princecfamall.com/api/admin/orders", {
    method: "GET"
  });
  const unauthResult = await verifyAdminAuth(unauthReq);
  assert.equal(unauthResult, false, "Request without token or cookie must be rejected");

  // Vérification de requête HTTP avec Authorization Bearer valide
  const authReq = new Request("https://princecfamall.com/api/admin/orders", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${validToken}`
    }
  });
  const authResult = await verifyAdminAuth(authReq);
  assert.equal(authResult, true, "Request with valid Bearer token must be accepted");
});

test("Sec-PreProd 4: Anti brute-force rate limiter protects critical routes", () => {
  const ip = `audit-test-ip-${Date.now()}`;
  
  // Test de limitation pour la connexion (5 tentatives / 15 min)
  for (let i = 1; i <= 5; i++) {
    const res = checkRateLimit(`auth:${ip}`, { intervalMs: 15 * 60 * 1000, maxRequests: 5 });
    assert.equal(res.success, true, `Attempt ${i} should be allowed`);
  }

  // 6ème tentative doit être bloquée
  const blockedAuth = checkRateLimit(`auth:${ip}`, { intervalMs: 15 * 60 * 1000, maxRequests: 5 });
  assert.equal(blockedAuth.success, false, "6th attempt must be blocked (Rate Limited)");
  assert.ok(blockedAuth.resetTime > Date.now(), "Reset time must be in future");

  // Test de limitation pour la création de commande (15 requêtes / 10 min)
  const orderIp = `order-ip-${Date.now()}`;
  for (let i = 1; i <= 15; i++) {
    const res = checkRateLimit(`order_create:${orderIp}`, { intervalMs: 10 * 60 * 1000, maxRequests: 15 });
    assert.equal(res.success, true);
  }
  const blockedOrder = checkRateLimit(`order_create:${orderIp}`, { intervalMs: 10 * 60 * 1000, maxRequests: 15 });
  assert.equal(blockedOrder.success, false, "Order spam beyond 15 requests must be blocked");
});

test("Sec-PreProd 5: VAPID keys separation and security", () => {
  // Clé publique : accessible pour la souscription navigateur
  assert.ok(VAPID_CONFIG.publicKey, "Public VAPID key must exist");
  assert.ok(typeof VAPID_CONFIG.publicKey === "string" && VAPID_CONFIG.publicKey.length > 50);

  // Sujet de contact
  assert.ok(VAPID_CONFIG.subject.startsWith("mailto:") || VAPID_CONFIG.subject.startsWith("https://"));
});

test("Sec-PreProd 6: ADMIN_JWT_SECRET enforcement and no password fallback in production", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalSecret = process.env.ADMIN_JWT_SECRET;
  const originalPwd = process.env.ADMIN_PASSWORD;

  try {
    process.env.NODE_ENV = "production";
    process.env.ADMIN_PASSWORD = "StrongAdminPassword2026!";

    // 1. Secret absent en production : refus catégorique avec erreur explicite
    delete process.env.ADMIN_JWT_SECRET;
    assert.throws(
      () => getAuthSecret(),
      /ADMIN_JWT_SECRET est absent, vide ou inférieur à 32 caractères/i,
      "Must throw when ADMIN_JWT_SECRET is missing in production"
    );
    assert.throws(
      () => generateAdminToken(),
      /ADMIN_JWT_SECRET/i,
      "generateAdminToken must throw when ADMIN_JWT_SECRET is missing in production"
    );
    // validateAdminToken doit renvoyer false sans planter
    assert.equal(validateAdminToken("adm.some.token.sig"), false, "Must return false when secret is absent in production");

    // 2. Secret vide ou constitué uniquement d'espaces : refus
    process.env.ADMIN_JWT_SECRET = "      ";
    assert.throws(
      () => getAuthSecret(),
      /ADMIN_JWT_SECRET est absent, vide ou inférieur à 32 caractères/i,
      "Must throw when ADMIN_JWT_SECRET is whitespace only in production"
    );

    // 3. Secret trop court (< 32 caractères) : refus
    process.env.ADMIN_JWT_SECRET = "short_key_only_24_chars!";
    assert.ok(process.env.ADMIN_JWT_SECRET.length < 32);
    assert.throws(
      () => getAuthSecret(),
      /inférieur à 32 caractères/i,
      "Must throw when ADMIN_JWT_SECRET is < 32 chars in production"
    );

    // 4. Aucun fallback dérivé de ADMIN_PASSWORD en production :
    // Même si ADMIN_PASSWORD est défini avec un mot de passe fort, le token legacy dérivé est strictement refusé
    delete process.env.ADMIN_JWT_SECRET;
    const legacyToken = `adm_${Buffer.from("StrongAdminPassword2026!:prince_cfa_salt_2026").toString("base64")}`;
    assert.equal(validateAdminToken(legacyToken), false, "Legacy password-derived token must be rejected in production");

    // 5. Secret valide d'au moins 32 caractères : accepté
    const robustSecret = "prince_cfa_super_robust_jwt_secret_key_32_characters_minimum_2026!";
    process.env.ADMIN_JWT_SECRET = robustSecret;
    assert.equal(getAuthSecret(), robustSecret, "Valid secret >= 32 chars must be accepted in production");

    const validProdToken = generateAdminToken();
    assert.ok(validProdToken.startsWith("adm."), "Token generated with robust secret must be valid");
    assert.equal(validateAdminToken(validProdToken), true, "Generated token must validate successfully");

  } finally {
    process.env.NODE_ENV = originalEnv;
    if (originalSecret !== undefined) process.env.ADMIN_JWT_SECRET = originalSecret;
    else delete process.env.ADMIN_JWT_SECRET;
    if (originalPwd !== undefined) process.env.ADMIN_PASSWORD = originalPwd;
    else delete process.env.ADMIN_PASSWORD;
  }
});

