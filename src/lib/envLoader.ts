import fs from "fs";
import path from "path";

let loadedEnvPath: string | null = null;
const scannedPathsLog: Array<{ path: string; exists: boolean; size?: number }> = [];

/**
 * Retourne le diagnostic complet des chemins scrutés pour le chargement d'environnement.
 */
export function getEnvDiagnostics() {
  return {
    loadedEnvPath,
    scanned: [...scannedPathsLog],
  };
}

/**
 * Construit la liste ordonnée des chemins potentiels du fichier .env
 * en explorant l'arborescence depuis plusieurs ancres d'exécution
 * (process.cwd, process.env.PWD, process.env.INIT_CWD et répertoires parents).
 */
export function getCandidateEnvPaths(): string[] {
  const anchors: string[] = [];

  try {
    anchors.push(process.cwd());
  } catch {}

  if (process.env.PWD && !anchors.includes(process.env.PWD)) {
    anchors.push(process.env.PWD);
  }
  if (process.env.INIT_CWD && !anchors.includes(process.env.INIT_CWD)) {
    anchors.push(process.env.INIT_CWD);
  }

  const pathsSet = new Set<string>();

  for (const anchor of anchors) {
    let currentDir = anchor;
    // Remonter jusqu'à 6 niveaux de dossiers parents
    for (let i = 0; i < 7; i++) {
      pathsSet.add(path.resolve(currentDir, ".env"));
      pathsSet.add(path.resolve(currentDir, ".env.local"));
      pathsSet.add(path.resolve(currentDir, ".env.production"));
      pathsSet.add(path.resolve(currentDir, "config", ".env"));
      pathsSet.add(path.resolve(currentDir, "hbuilds", "config", ".env"));
      pathsSet.add(path.resolve(currentDir, "hbuilds", "current", ".env"));
      pathsSet.add(path.resolve(currentDir, "current", ".env"));
      pathsSet.add(path.resolve(currentDir, "public_html", ".env"));

      const parent = path.dirname(currentDir);
      if (!parent || parent === currentDir) break;
      currentDir = parent;
    }
  }

  // Chemins absolus Hostinger Web Apps / Cloud conventionnels
  const wellKnown = [
    "/files/hbuilds/config/.env",
    "/files/config/.env",
  ];
  for (const wk of wellKnown) {
    pathsSet.add(wk);
  }

  // Recherche dynamique des répertoires /home/*/domains/*/hbuilds/config/.env sous Linux
  if (process.platform === "linux") {
    try {
      const homeRoot = "/home";
      if (fs.existsSync(homeRoot)) {
        const users = fs.readdirSync(homeRoot);
        for (const user of users) {
          const userDir = path.join(homeRoot, user);
          pathsSet.add(path.join(userDir, "hbuilds", "config", ".env"));
          const domainsDir = path.join(userDir, "domains");
          if (fs.existsSync(domainsDir)) {
            const domains = fs.readdirSync(domainsDir);
            for (const domain of domains) {
              pathsSet.add(path.join(domainsDir, domain, "hbuilds", "config", ".env"));
              pathsSet.add(path.join(domainsDir, domain, "config", ".env"));
              pathsSet.add(path.join(domainsDir, domain, ".env"));
            }
          }
        }
      }
    } catch {}
  }

  return Array.from(pathsSet);
}

/**
 * Chargeur d'environnement résilient pour Next.js Standalone (Hostinger / Docker / Cloud).
 * Détecte et charge le fichier .env depuis le répertoire d'exécution,
 * l'arborescence parente ou la configuration partagée Hostinger (hbuilds/config/.env).
 */
export function ensureEnvLoaded(): void {
  if (typeof window !== "undefined") {
    return;
  }

  // Si Firebase Admin ou les secrets sont déjà configurés dans process.env, rien à faire
  const hasFirebase = Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
  );
  const hasAdmin = Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_JWT_SECRET);

  if (hasFirebase && hasAdmin) {
    return;
  }

  const candidates = getCandidateEnvPaths();

  for (const envPath of candidates) {
    try {
      if (fs.existsSync(envPath) && fs.statSync(envPath).isFile()) {
        const stat = fs.statSync(envPath);
        scannedPathsLog.push({ path: envPath, exists: true, size: stat.size });
        const content = fs.readFileSync(envPath, "utf8");
        parseAndApplyEnv(content);
        loadedEnvPath = envPath;
        console.log("[envLoader] Variables d'environnement chargées avec succès depuis :", envPath);

        const nowHasFirebase = Boolean(
          process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
          (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
        );
        if (nowHasFirebase) {
          break;
        }
      } else {
        if (scannedPathsLog.length < 30) {
          scannedPathsLog.push({ path: envPath, exists: false });
        }
      }
    } catch {
      // Ignorer silencieusement si inaccessible
    }
  }
}

/**
 * Analyse robuste d'un fichier .env supportant :
 * 1. Variables standard simples KEY=VAL
 * 2. Valeurs avec guillemets simples ou doubles KEY="VAL" / KEY='VAL'
 * 3. Clés PEM multilignes avec ou sans guillemets (-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----)
 * 4. Objets JSON multilignes non échappés (KEY={ ... })
 * 5. Commentaires ignorés en fin de ligne
 */
export function parseAndApplyEnv(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!content || typeof content !== "string") return result;

  const lines = content.split(/\r?\n/);
  let currentKey = "";
  let currentValue = "";
  let mode: "none" | "quoted" | "pem" | "json" = "none";
  let quoteChar = "";

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Mode multiligne en cours
    if (mode !== "none") {
      if (mode === "quoted") {
        currentValue += "\n" + rawLine;
        if (trimmed.endsWith(quoteChar)) {
          let cleanVal = currentValue.trim();
          if (cleanVal.startsWith(quoteChar) && cleanVal.endsWith(quoteChar)) {
            cleanVal = cleanVal.slice(1, -1);
          }
          applyKeyValue(currentKey, cleanVal, result);
          currentKey = "";
          currentValue = "";
          mode = "none";
        }
        continue;
      }

      if (mode === "pem") {
        currentValue += "\n" + rawLine;
        if (trimmed.includes("-----END")) {
          let cleanVal = currentValue.trim();
          if ((cleanVal.startsWith('"') && cleanVal.endsWith('"')) || (cleanVal.startsWith("'") && cleanVal.endsWith("'"))) {
            cleanVal = cleanVal.slice(1, -1);
          }
          applyKeyValue(currentKey, cleanVal, result);
          currentKey = "";
          currentValue = "";
          mode = "none";
        }
        continue;
      }

      if (mode === "json") {
        currentValue += "\n" + rawLine;
        if (trimmed.endsWith("}")) {
          applyKeyValue(currentKey, currentValue.trim(), result);
          currentKey = "";
          currentValue = "";
          mode = "none";
        }
        continue;
      }
    }

    // Ligne vide ou commentaire
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const eqIdx = rawLine.indexOf("=");
    if (eqIdx <= 0) {
      continue;
    }

    const key = rawLine.slice(0, eqIdx).trim();
    let val = rawLine.slice(eqIdx + 1).trim();

    // Détection de début de clé PEM sans guillemets ou avec guillemet ouvrant
    if (val.includes("-----BEGIN") && !val.includes("-----END")) {
      mode = "pem";
      currentKey = key;
      currentValue = val;
      continue;
    }

    // Détection de début de JSON multiligne
    if (val.startsWith("{") && !val.endsWith("}")) {
      mode = "json";
      currentKey = key;
      currentValue = val;
      continue;
    }

    // Détection de chaîne entre guillemets (monoligne ou multiligne)
    const startsWithQuote = val.startsWith('"') || val.startsWith("'");
    if (startsWithQuote) {
      quoteChar = val[0];
      const closingIdx = val.lastIndexOf(quoteChar);
      if (closingIdx > 0) {
        // La chaîne est fermée sur la même ligne (les commentaires éventuels après closingIdx sont ignorés)
        const inside = val.slice(1, closingIdx);
        applyKeyValue(key, inside, result);
        continue;
      } else {
        // Guillemet sans fermeture sur cette ligne -> début de chaîne multiligne
        mode = "quoted";
        currentKey = key;
        currentValue = val;
        continue;
      }
    }

    // Retirer commentaire inline si présent (# non échappé)
    const commentIdx = val.indexOf(" #");
    if (commentIdx > 0) {
      val = val.slice(0, commentIdx).trim();
    }

    applyKeyValue(key, val, result);
  }

  return result;
}

function applyKeyValue(key: string, value: string, result: Record<string, string>): void {
  if (!key) return;
  result[key] = value;
  // Appliquer dans process.env si non défini ou vide
  if (!process.env[key] || process.env[key]!.trim() === "") {
    process.env[key] = value;
  }
}
