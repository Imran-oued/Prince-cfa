import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Brand Icons 1: Les icônes officielles Prince CFA pour navigateur et mobile existent", () => {
  const root = process.cwd();
  
  // Fichiers d'icônes essentiels
  const files = [
    "src/app/favicon.ico",
    "src/app/icon.png",
    "src/app/apple-icon.png",
    "public/favicon.ico",
    "public/favicon-32x32.png",
    "public/favicon-16x16.png",
    "public/apple-touch-icon.png",
    "public/apple-touch-icon-precomposed.png",
    "public/icon-192.png",
    "public/icon-512.png",
    "public/manifest.json"
  ];

  for (const file of files) {
    const fullPath = path.join(root, file);
    assert.ok(fs.existsSync(fullPath), `Le fichier ${file} doit exister.`);
    const stats = fs.statSync(fullPath);
    assert.ok(stats.size > 100, `Le fichier ${file} ne doit pas être vide (taille: ${stats.size} octets).`);
  }
});

test("Brand Icons 2: Le manifest.json est valide et intègre les icônes de la marque", () => {
  const manifestPath = path.join(process.cwd(), "public", "manifest.json");
  const content = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  assert.equal(content.short_name, "Prince CFA");
  assert.ok(Array.isArray(content.icons) && content.icons.length >= 3);
  assert.ok(content.icons.some(i => i.src === "/apple-touch-icon.png"));
  assert.ok(content.icons.some(i => i.src === "/icon-192.png"));
  assert.ok(content.icons.some(i => i.src === "/icon-512.png"));
});

test("Brand Icons 3: Le layout racine inclut les métadonnées et balises d'icônes Apple et Favicon", () => {
  const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
  const content = fs.readFileSync(layoutPath, "utf-8");

  assert.ok(content.includes('apple-touch-icon'), "layout.tsx doit lier l'icône apple-touch-icon");
  assert.ok(content.includes('/manifest.json'), "layout.tsx doit référencer le web manifest");
  assert.ok(content.includes('/favicon.ico'), "layout.tsx doit référencer le favicon officiel");
});
