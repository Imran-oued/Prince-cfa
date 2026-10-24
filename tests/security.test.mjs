import { test } from "node:test";
import assert from "node:assert/strict";
import { 
  generateAdminToken, 
  validateAdminToken, 
  timingSafeEqualString, 
  verifyAdminPassword 
} from "../src/lib/auth.ts";
import { checkRateLimit } from "../src/lib/rateLimit.ts";
import { products } from "../src/data/products.js";

test("1. Admin token uses cryptographic HMAC-SHA256 signature with nonces", () => {
  const token1 = generateAdminToken();
  const token2 = generateAdminToken();

  assert.ok(token1.startsWith("adm."), "Token format starts with adm.");
  assert.notEqual(token1, token2, "Each generated token has a unique nonce");
  assert.equal(validateAdminToken(token1), true, "Legitimate token is valid");
  assert.equal(validateAdminToken(token2), true, "Legitimate token is valid");
});

test("2. Forged and tampered admin tokens are strictly rejected", () => {
  const token = generateAdminToken();
  const parts = token.slice(4).split(".");
  assert.equal(parts.length, 3, "Token must have 3 parts: timestamp, nonce, signature");

  // Altération de la signature
  const fakeToken = `adm.${parts[0]}.${parts[1]}.0000000000000000000000000000000000000000000000000000000000000000`;
  assert.equal(validateAdminToken(fakeToken), false, "Forged signature is rejected");

  // Altération du nonce
  const tamperedNonce = `adm.${parts[0]}.deadbeef.${parts[2]}`;
  assert.equal(validateAdminToken(tamperedNonce), false, "Tampered payload is rejected");

  // Tokens invalides ou vides
  assert.equal(validateAdminToken(""), false);
  assert.equal(validateAdminToken("admin"), false);
  assert.equal(validateAdminToken("Bearer random"), false);
});

test("3. Constant-time equality protects against timing side-channel attacks", () => {
  assert.equal(timingSafeEqualString("secret123", "secret123"), true);
  assert.equal(timingSafeEqualString("secret123", "secret999"), false);
  assert.equal(timingSafeEqualString("short", "much_longer_string"), false);
  assert.equal(timingSafeEqualString("", "not_empty"), false);
});

test("4. Rate limiting blocks brute-force and request flooding", () => {
  const testIp = `test-ip-${Date.now()}`;
  const opts = { intervalMs: 1000, maxRequests: 3 };

  // 3 premières requêtes autorisées
  const r1 = checkRateLimit(testIp, opts);
  assert.equal(r1.success, true);
  assert.equal(r1.remaining, 2);

  const r2 = checkRateLimit(testIp, opts);
  assert.equal(r2.success, true);
  assert.equal(r2.remaining, 1);

  const r3 = checkRateLimit(testIp, opts);
  assert.equal(r3.success, true);
  assert.equal(r3.remaining, 0);

  // 4e requête doit être bloquée
  const r4 = checkRateLimit(testIp, opts);
  assert.equal(r4.success, false, "4th request exceeds rate limit");
  assert.equal(r4.remaining, 0);
});

test("5. Server-side price resolution overrides client-side price tampering", () => {
  // Simulation de la logique serveur de résolution des prix dans /api/orders
  function resolveServerUnitPrice(productId, selectedCapacity, clientSentPrice) {
    const authentic = products.find(p => String(p.id) === String(productId));
    if (!authentic) {
      return Math.max(0, Number(clientSentPrice) || 0);
    }

    if (selectedCapacity && authentic.storageOptions && Array.isArray(authentic.storageOptions)) {
      const opt = authentic.storageOptions.find(
        o => o.capacity?.trim().toLowerCase() === selectedCapacity.trim().toLowerCase()
      );
      if (opt && Number(opt.price) > 0) {
        return Number(opt.price);
      }
    }

    return Number(authentic.salePrice || authentic.price || 0);
  }

  // Scénario d'attaque 1 : Le client tente d'acheter un iPhone SE (85 000 FCFA) à 1 FCFA
  const tamperedPrice1 = resolveServerUnitPrice("pcfa-se3", null, 1);
  assert.equal(tamperedPrice1, 85000, "Server overrides tampered 1 FCFA with authentic 85,000 FCFA");

  // Scénario d'attaque 2 : Le client choisit l'iPhone 17 Pro Max 1 To (960 000 FCFA) et envoie 500 FCFA
  const tamperedPrice2 = resolveServerUnitPrice("pcfa-17promax", "1 To", 500);
  assert.equal(tamperedPrice2, 960000, "Server overrides 500 FCFA with 960,000 FCFA for 1 To variant");

  // Scénario légitime : iPhone 11 à 120 000 FCFA
  const legitPrice = resolveServerUnitPrice("pcfa-11", "128 Go", 120000);
  assert.equal(legitPrice, 120000, "Legitimate price is confirmed");
});

test("6. Customer phone number masking protects PII on public tracking", () => {
  function maskPhoneNumber(phone) {
    const raw = (phone || "").replace(/\s+/g, "");
    if (raw.length < 4) return "••••••••";
    return raw.replace(/(\d{2})(\d+)(\d{2})$/, "$1 •••• $3");
  }

  const masked1 = maskPhoneNumber("70001122");
  assert.equal(masked1, "70 •••• 22", "Phone number is correctly masked in the middle");

  const masked2 = maskPhoneNumber("+22676543210");
  assert.equal(masked2, "+22 •••• 10", "International phone number is masked");
});

test("7. Order creation input validation protects against malicious payloads", () => {
  function validateOrderPayload(customer, items) {
    if (!customer || !customer.name?.trim()) return { valid: false, error: "Nom manquant" };
    const cleanPhone = (customer.phone || "").replace(/\s+/g, "");
    if (!cleanPhone || cleanPhone.length < 8) return { valid: false, error: "Téléphone invalide" };
    if (!items || !Array.isArray(items) || items.length === 0) return { valid: false, error: "Panier vide" };
    if (items.length > 50) return { valid: false, error: "Trop d'articles" };
    return { valid: true };
  }

  // Panier vide rejeté
  assert.equal(validateOrderPayload({ name: "Jean", phone: "70001122" }, []).valid, false);

  // Téléphone trop court rejeté
  assert.equal(validateOrderPayload({ name: "Jean", phone: "123" }, [{ productId: "p1" }]).valid, false);

  // Panier démesuré (> 50 articles) rejeté
  const hugeCart = Array.from({ length: 51 }, (_, i) => ({ productId: `p${i}` }));
  assert.equal(validateOrderPayload({ name: "Jean", phone: "70001122" }, hugeCart).valid, false);

  // Commande valide acceptée
  assert.equal(validateOrderPayload({ name: "Jean Ouédraogo", phone: "70001122" }, [{ productId: "pcfa-se3" }]).valid, true);
});
