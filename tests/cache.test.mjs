import { test } from "node:test";
import assert from "node:assert";
import { getCachedProducts, invalidateProductsCache, getCachedOrders, invalidateOrdersCache } from "../src/lib/serverCache.ts";

test("1. getCachedProducts returns a non-empty array of products", async () => {
  invalidateProductsCache();
  const products = await getCachedProducts();
  assert.ok(Array.isArray(products), "Products must be an array");
  assert.ok(products.length > 0, "Products array must not be empty");
  
  // Verify standard fields
  const first = products[0];
  assert.ok(first.id, "Product must have an id");
  assert.ok(first.name, "Product must have a name");
  assert.ok(first.price > 0, "Product must have a positive price");
});

test("2. getCachedProducts serves from in-memory cache without repeated calls", async () => {
  const t0 = Date.now();
  const p1 = await getCachedProducts();
  const t1 = Date.now();
  const p2 = await getCachedProducts();
  const t2 = Date.now();

  assert.strictEqual(p1.length, p2.length, "Cached products count must match");
  // Second call must be instant (<= 15ms)
  assert.ok((t2 - t1) <= 15, `Cached retrieval should be under 15ms, took ${t2 - t1}ms`);
});

test("3. invalidateProductsCache resets the cache cleanly", async () => {
  await getCachedProducts();
  invalidateProductsCache();
  const fresh = await getCachedProducts();
  assert.ok(Array.isArray(fresh) && fresh.length > 0, "Must be able to repopulate after invalidation");
});

test("4. getCachedOrders and invalidateOrdersCache operate safely", async () => {
  invalidateOrdersCache();
  const orders = await getCachedOrders();
  assert.ok(Array.isArray(orders), "Orders must return an array");
  invalidateOrdersCache();
});
