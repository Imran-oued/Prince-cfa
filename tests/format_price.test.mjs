import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPrice } from "../src/lib/formatPrice.ts";

test("formatPrice formats numbers with visible space separator every 3 digits", () => {
  assert.equal(formatPrice(10000), "10 000");
  assert.equal(formatPrice(8000), "8 000");
  assert.equal(formatPrice(8500), "8 500");
  assert.equal(formatPrice(1000), "1 000");
  assert.equal(formatPrice(75000), "75 000");
  assert.equal(formatPrice(146500), "146 500");
  assert.equal(formatPrice(5033000), "5 033 000");
  assert.equal(formatPrice(0), "0");
  assert.equal(formatPrice(500), "500");
});

test("formatPrice handles string inputs and legacy values cleanly", () => {
  assert.equal(formatPrice("10000"), "10 000");
  assert.equal(formatPrice("8000"), "8 000");
  assert.equal(formatPrice("8500 FCFA"), "8 500");
  assert.equal(formatPrice(null), "0");
  assert.equal(formatPrice(undefined), "0");
  assert.equal(formatPrice(""), "0");
});
