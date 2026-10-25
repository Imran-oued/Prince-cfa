/**
 * Script de mise à jour Firestore pour le produit 'Moto Electrique' (ID: UOGdbGVosnh6CovWNOkD).
 * Remplace les chaînes Base64 par les URLs statiques /products/mobility/moto-electrique-1.jpg et moto-electrique-2.jpg.
 *
 * NOTE DE SÉCURITÉ : Ce script ne s'exécute JAMAIS automatiquement.
 * Il nécessite l'autorisation explicite de l'utilisateur.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../src/lib/firebase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);

async function main() {
  if (!isFirebaseConfigured()) {
    console.error("❌ Firebase n'est pas configuré dans l'environnement actuel.");
    process.exit(1);
  }

  // 1. Contrôle strict du projet cible (Garde-fou anti-erreur d'environnement)
  const currentProject = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const expectedProject = "price-cfa";
  if (currentProject !== expectedProject) {
    console.error(`❌ Refus d'exécution : projet ciblé "${currentProject}" différent du projet attendu "${expectedProject}".`);
    process.exit(1);
  }

  const docId = "UOGdbGVosnh6CovWNOkD";
  const docRef = doc(db, "products", docId);

  // 2. Sauvegarde préalable obligatoire avant toute écriture
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    console.error(`❌ Document ${docId} introuvable dans Firestore.`);
    process.exit(1);
  }

  const currentData = snap.data();
  const backupFile = path.join(rootDir, ".backup_products_original", "moto_electrique_firestore_backup.json");
  fs.mkdirSync(path.dirname(backupFile), { recursive: true });
  fs.writeFileSync(backupFile, JSON.stringify({ id: docId, ...currentData }, null, 2));
  console.log(`✅ Sauvegarde de sécurité créée : ${backupFile}`);

  // 3. Mise à jour ciblée exclusive des champs d'image (les autres champs restent intacts)
  const payload = {
    image: "/products/mobility/moto-electrique-1.jpg",
    images: [
      "/products/mobility/moto-electrique-1.jpg",
      "/products/mobility/moto-electrique-2.jpg"
    ],
    updatedAt: new Date().toISOString()
  };

  console.log(`Mise à jour ciblée du document Firestore ${docId}...`);
  await updateDoc(docRef, payload);
  console.log("✅ Mise à jour Firestore terminée avec succès.");
}

main().catch(console.error);
