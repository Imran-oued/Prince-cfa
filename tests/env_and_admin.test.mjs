import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizePrivateKey, getAdminInitError } from "../src/lib/firebaseAdmin.ts";
import { parseAndApplyEnv, getCandidateEnvPaths, getEnvDiagnostics } from "../src/lib/envLoader.ts";

test("Env & Admin 1: normalizePrivateKey cleans quotes, escaped newlines, and carriage returns", () => {
  const sampleKey = "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7...\\n-----END PRIVATE KEY-----\\n";
  const wrappedKey = `"${sampleKey}"`;

  const cleaned = normalizePrivateKey(wrappedKey);
  assert.equal(cleaned.startsWith("-----BEGIN PRIVATE KEY-----\n"), true);
  assert.equal(cleaned.endsWith("-----END PRIVATE KEY-----"), true);
  assert.equal(cleaned.includes("\\n"), false, "Must not contain literal escaped \\n");
  assert.equal(cleaned.includes("\r"), false, "Must not contain \\r");
});

test("Env & Admin 2: normalizePrivateKey recovers raw base64 key lacking PEM headers", () => {
  const dummyBase64 = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7" + "A".repeat(500);
  const normalized = normalizePrivateKey(dummyBase64);

  assert.equal(normalized.startsWith("-----BEGIN PRIVATE KEY-----\n"), true);
  assert.equal(normalized.endsWith("-----END PRIVATE KEY-----"), true);
});

test("Env & Admin 3: normalizePrivateKey extracts private_key from embedded JSON", () => {
  const jsonWithKey = JSON.stringify({
    project_id: "price-cfa",
    private_key: "-----BEGIN PRIVATE KEY-----\\nMIIEvg...\\n-----END PRIVATE KEY-----\\n"
  });

  const normalized = normalizePrivateKey(jsonWithKey);
  assert.equal(normalized.startsWith("-----BEGIN PRIVATE KEY-----\n"), true);
  assert.equal(normalized.endsWith("-----END PRIVATE KEY-----"), true);
});

test("Env & Admin 4: parseAndApplyEnv correctly parses multiline PEM keys without quotes", () => {
  const envContent = `
# Commentaire
FIREBASE_PROJECT_ID=price-cfa
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@price-cfa.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7
v9Z8Q...
-----END PRIVATE KEY-----
ADMIN_PASSWORD=mySuperSecretPassword123
`;

  const parsed = parseAndApplyEnv(envContent);
  assert.equal(parsed.FIREBASE_PROJECT_ID, "price-cfa");
  assert.equal(parsed.FIREBASE_CLIENT_EMAIL, "firebase-adminsdk@price-cfa.iam.gserviceaccount.com");
  assert.equal(parsed.FIREBASE_PRIVATE_KEY.includes("-----BEGIN PRIVATE KEY-----"), true);
  assert.equal(parsed.FIREBASE_PRIVATE_KEY.includes("MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7"), true);
  assert.equal(parsed.FIREBASE_PRIVATE_KEY.includes("-----END PRIVATE KEY-----"), true);
  assert.equal(parsed.ADMIN_PASSWORD, "mySuperSecretPassword123");
});

test("Env & Admin 5: parseAndApplyEnv handles multiline quoted strings and inline comments", () => {
  const envContent = `
ADMIN_JWT_SECRET="this_is_a_very_long_secret_key_with_more_than_32_characters!" # inline comment
FIREBASE_PROJECT_ID=price-cfa # another comment
`;

  const parsed = parseAndApplyEnv(envContent);
  assert.equal(parsed.ADMIN_JWT_SECRET, "this_is_a_very_long_secret_key_with_more_than_32_characters!");
  assert.equal(parsed.FIREBASE_PROJECT_ID, "price-cfa");
});

test("Env & Admin 6: getCandidateEnvPaths checks parent directories and Hostinger paths", () => {
  const candidates = getCandidateEnvPaths();
  assert.equal(Array.isArray(candidates), true);
  assert.equal(candidates.length > 5, true);

  const hasConfigEnv = candidates.some(c => c.includes("config") && c.includes(".env"));
  assert.equal(hasConfigEnv, true, "Must include config/.env candidate");

  const hasHbuildsConfig = candidates.some(c => c.includes("hbuilds"));
  assert.equal(hasHbuildsConfig, true, "Must include hbuilds candidate");
});
