/**
 * Script de restauration Firestore pour le produit 'Moto Electrique' (ID: UOGdbGVosnh6CovWNOkD).
 * Restaure l'état exact antérieur depuis .backup_products_original/moto_electrique_firestore_backup.json.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { doc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../src/lib/firebase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);

async function main() {
  if (!isFirebaseConfigured()) {
    console.error("❌ Firebase n'est pas configuré dans l'environnement actuel.");
    process.exit(1);
  }

  const backupFile = path.join(rootDir, ".backup_products_original", "moto_electrique_firestore_backup.json");
  if (!fs.existsSync(backupFile)) {
    console.error(`❌ Fichier de sauvegarde introuvable: ${backupFile}`);
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(backupFile, "utf-8"));
  const { id, ...dataToRestore } = rawData;
  const docRef = doc(db, "products", id);

  console.log(`Restauration du document Firestore ${id} depuis la sauvegarde...`);
  await setDoc(docRef, dataToRestore);
  console.log("✅ Restauration Firestore terminée avec succès.");
}

main().catch(console.error);
