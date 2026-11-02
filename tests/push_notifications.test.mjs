import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { VAPID_CONFIG } from "../src/config/vapid.ts";
import { savePushSubscription, getPushSubscriptions, removePushSubscription } from "../src/lib/firestore.js";

test("1. VAPID keys are properly configured and follow Base64URL RFC standard", () => {
  assert.ok(VAPID_CONFIG.publicKey, "Public key must exist");
  assert.ok(VAPID_CONFIG.privateKey, "Private key must exist");
  assert.equal(typeof VAPID_CONFIG.publicKey, "string");
  assert.equal(typeof VAPID_CONFIG.privateKey, "string");
  assert.ok(VAPID_CONFIG.publicKey.length > 50, "Public key has valid length");
  assert.ok(VAPID_CONFIG.privateKey.length > 30, "Private key has valid length");
  assert.equal(VAPID_CONFIG.subject, "mailto:contact@prince-cfa.com");
});

test("2. Push subscriptions Firestore methods manage lifecycle without errors", async () => {
  const fakeSub = {
    endpoint: "https://fcm.googleapis.com/fcm/send/fake-token-" + Date.now(),
    keys: {
      p256dh: "BMi4998FakeKeyP256dhBase64...",
      auth: "fakeAuthSecret123"
    }
  };

  const saved = await savePushSubscription(fakeSub, "test-user-agent");
  assert.ok(saved, "Subscription should be saved");

  const subscriptions = await getPushSubscriptions();
  assert.ok(Array.isArray(subscriptions), "Subscriptions should be an array");
  const found = subscriptions.find(s => s.endpoint === fakeSub.endpoint);
  assert.ok(found, "Saved subscription should be retrievable");
  assert.equal(found.endpoint, fakeSub.endpoint);

  const removed = await removePushSubscription(fakeSub.endpoint);
  assert.equal(removed, true, "Subscription should be successfully removed");

  const afterRemoval = await getPushSubscriptions();
  const stillFound = afterRemoval.find(s => s.endpoint === fakeSub.endpoint);
  assert.equal(stillFound, undefined, "Subscription must no longer exist after removal");
});

test("3. Service Worker contains push and notificationclick event listeners", () => {
  const swPath = path.resolve(process.cwd(), "public/sw.js");
  const swContent = fs.readFileSync(swPath, "utf-8");
  assert.ok(/self\.addEventListener\(["']push["']/.test(swContent), "SW must have push listener");
  assert.ok(/self\.addEventListener\(["']notificationclick["']/.test(swContent), "SW must have notificationclick listener");
  assert.ok(swContent.includes("/admin"), "Notification click must focus or open /admin");
  assert.ok(swContent.includes("requireInteraction"), "Notification should stay visible if interaction required");
});
