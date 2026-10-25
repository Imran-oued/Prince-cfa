async function testEtag() {
  // 1. Première requête (200 OK)
  const res1 = await fetch("http://127.0.0.1:3000/api/products");
  const etag1 = res1.headers.get("etag");
  const text1 = await res1.text();
  console.log("Test 1 — Requête initiale :");
  console.log("  Status:", res1.status);
  console.log("  ETag reçu:", etag1);
  console.log("  Taille du corps:", text1.length, "octets");

  // 2. Deuxième requête avec If-None-Match exact (304 Not Modified)
  const res2 = await fetch("http://127.0.0.1:3000/api/products", {
    headers: { "if-none-match": etag1 }
  });
  const text2 = await res2.text();
  console.log("\nTest 2 — Requête conditionnelle avec ETag valide :");
  console.log("  Status:", res2.status, "(Doit être 304)");
  console.log("  Taille du corps:", text2.length, "octets (Doit être 0)");

  // 3. Troisième requête avec ETag obsolète / différent (200 OK)
  const res3 = await fetch("http://127.0.0.1:3000/api/products", {
    headers: { "if-none-match": 'W/"prod-obsolete-hash-73"' }
  });
  const text3 = await res3.text();
  console.log("\nTest 3 — Requête conditionnelle avec ETag périmé :");
  console.log("  Status:", res3.status, "(Doit être 200)");
  console.log("  Taille du corps:", text3.length, "octets");
}

testEtag().catch(console.error);
