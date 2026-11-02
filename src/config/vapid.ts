/**
 * Configuration officielle des clés VAPID pour les notifications Web Push Prince CFA
 */
export const VAPID_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BKoj_69RaUCQNGXnhDd1SWI4X10dPEoqQpWuNxSaEVZkgYr4MfGtfsXMAASPiUL96vVr-GEMESngy0-Y0bIEZpw",
  privateKey: process.env.VAPID_PRIVATE_KEY || "jZ_kBPAaVYv7o_ztzEd3mpcFhvrlZl11ou1i4pA1g0c",
  subject: "mailto:contact@prince-cfa.com"
};

