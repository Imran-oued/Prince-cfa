import fs from "fs";
import path from "path";

let hasAttemptedLoad = false;

/**
 * Chargeur d'environnement résilient pour Next.js Standalone (Hostinger / Docker / Cloud).
 * Next.js standalone n'injecte pas automatiquement les fichiers .env au runtime.
 * Cette fonction détecte et charge le fichier .env depuis le répertoire courant
 * ou depuis les dossiers de configuration partagée d'Hostinger (hbuilds/config/.env).
 */
export function ensureEnvLoaded(): void {
  if (typeof window !== "undefined") {
    return;
  }

  // Si les variables clés sont déjà dans process.env, rien à faire
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.ADMIN_PASSWORD) {
    return;
  }

  if (hasAttemptedLoad) {
    return;
  }
  hasAttemptedLoad = true;

  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, ".env"),
    path.resolve(cwd, ".env.local"),
    path.resolve(cwd, ".env.production"),
    path.resolve(cwd, "config/.env"),
    path.resolve(cwd, "../config/.env"),
    path.resolve(cwd, "../../config/.env"),
    path.resolve(cwd, "../../../config/.env"),
    path.resolve(cwd, "../.env"),
    path.resolve(cwd, "../../.env"),
  ];

  for (const envPath of candidates) {
    try {
      if (fs.existsSync(envPath) && fs.statSync(envPath).isFile()) {
        const content = fs.readFileSync(envPath, "utf8");
        parseAndApplyEnv(content);
        if (process.env.FIREBASE_CLIENT_EMAIL || process.env.ADMIN_PASSWORD) {
          console.log("[envLoader] Variables chargées avec succès depuis :", envPath);
          break;
        }
      }
    } catch {
      // Ignorer silencieusement si un chemin n'est pas lisible
    }
  }
}

function parseAndApplyEnv(content: string): void {
  const lines = content.split(/\r?\n/);
  let currentKey = "";
  let currentValue = "";
  let isMultiLine = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (isMultiLine) {
      currentValue += "\n" + line;
      if (trimmed.endsWith('"') || trimmed.endsWith("'")) {
        isMultiLine = false;
        let val = currentValue.trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[currentKey]) {
          process.env[currentKey] = val;
        }
        currentKey = "";
        currentValue = "";
      }
      continue;
    }

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const eqIdx = line.indexOf("=");
    if (eqIdx > 0) {
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();

      // Vérifier si c'est une valeur multiligne avec guillemet ouvrant sans guillemet fermant
      const hasOpeningQuote = (val.startsWith('"') || val.startsWith("'"));
      const hasClosingQuote = (val.endsWith('"') || val.endsWith("'")) && val.length > 1;

      if (hasOpeningQuote && !hasClosingQuote) {
        isMultiLine = true;
        currentKey = key;
        currentValue = val;
      } else {
        if (hasOpeningQuote && hasClosingQuote) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

