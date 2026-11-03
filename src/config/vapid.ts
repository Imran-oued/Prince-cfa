/**
 * Configuration officielle des clés VAPID pour les notifications Web Push Prince CFA
 */
const IS_PROD = process.env.NODE_ENV === "production";

export const VAPID_CONFIG = {
  publicKey:
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    "BKoj_69RaUCQNGXnhDd1SWI4X10dPEoqQpWuNxSaEVZkgYr4MfGtfsXMAASPiUL96vVr-GEMESngy0-Y0bIEZpw",
  // En production, la clé privée doit être configurée via la variable d'environnement VAPID_PRIVATE_KEY
  privateKey:
    process.env.VAPID_PRIVATE_KEY ||
    (IS_PROD ? "" : "jZ_kBPAaVYv7o_ztzEd3mpcFhvrlZl11ou1i4pA1g0c"),
  subject: process.env.VAPID_SUBJECT || "mailto:contact@prince-cfa.com",
};

if (IS_PROD && !process.env.VAPID_PRIVATE_KEY) {
  console.warn(
    "[SÉCURITÉ] VAPID_PRIVATE_KEY non définie en production. Les notifications push vers les administrateurs nécessitent cette clé."
  );
}

