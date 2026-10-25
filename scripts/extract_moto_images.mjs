import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);

async function main() {
  const { getProduct } = await import("../src/lib/firestore.js");
  const p = await getProduct("UOGdbGVosnh6CovWNOkD");

  if (!p) {
    console.error("Produit introuvable dans Firestore");
    process.exit(1);
  }

  const mobilityDir = path.join(rootDir, "public", "products", "mobility");
  fs.mkdirSync(mobilityDir, { recursive: true });

  const targetPath1 = path.join(mobilityDir, "moto-electrique-1.jpg");
  const targetPath2 = path.join(mobilityDir, "moto-electrique-2.jpg");

  // Décoder image 0
  const base64Data1 = (p.images?.[0] || p.image).replace(/^data:image\/\w+;base64,/, "");
  const buffer1 = Buffer.from(base64Data1, "base64");
  fs.writeFileSync(targetPath1, buffer1);
  console.log(`Image 1 extraite : ${targetPath1} (${(buffer1.length / 1024).toFixed(1)} Ko)`);

  // Décoder image 1
  if (p.images?.[1]) {
    const base64Data2 = p.images[1].replace(/^data:image\/\w+;base64,/, "");
    const buffer2 = Buffer.from(base64Data2, "base64");
    fs.writeFileSync(targetPath2, buffer2);
    console.log(`Image 2 extraite : ${targetPath2} (${(buffer2.length / 1024).toFixed(1)} Ko)`);
  }

  console.log("Extraction terminée avec succès.");
}

main().catch(console.error);
