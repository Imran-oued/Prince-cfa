/**
 * Script de mise à jour Firestore pour le produit 'Moto Electrique' (ID: UOGdbGVosnh6CovWNOkD).
 * Remplace les chaînes Base64 par les URLs statiques /products/mobility/moto-electrique-1.jpg et moto-electrique-2.jpg.
 *
 * NOTE DE SÉCURITÉ : Ce script ne s'exécute JAMAIS automatiquement.
 * Il nécessite l'autorisation explicite de l'utilisateur.
 */

import { doc, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../src/lib/firebase.js";

async function main() {
  if (!isFirebaseConfigured()) {
    console.error("❌ Firebase n'est pas configuré dans l'environnement actuel.");
    process.exit(1);
  }

  const docId = "UOGdbGVosnh6CovWNOkD";
  const docRef = doc(db, "products", docId);

  const payload = {
    image: "/products/mobility/moto-electrique-1.jpg",
    images: [
      "/products/mobility/moto-electrique-1.jpg",
      "/products/mobility/moto-electrique-2.jpg"
    ],
    updatedAt: new Date().toISOString()
  };

  console.log(`Mise à jour du document Firestore ${docId}...`);
  await updateDoc(docRef, payload);
  console.log("✅ Mise à jour Firestore terminée avec succès.");
}

main().catch(console.error);
