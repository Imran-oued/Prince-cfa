import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import { getEnvDiagnostics, ensureEnvLoaded } from "@/lib/envLoader";
import { getAdminApp, getAdminFirestore, getAdminInitError, normalizePrivateKey } from "@/lib/firebaseAdmin";

const DIAGNOSTIC_SECRET = "prince-diag-2026";

export async function GET(request: Request) {
  try {
    ensureEnvLoaded();

    const url = new URL(request.url);
    const keyParam = url.searchParams.get("key");
    const keyHeader = request.headers.get("x-diagnostic-key");

    const isKeyValid = (keyParam === DIAGNOSTIC_SECRET || keyHeader === DIAGNOSTIC_SECRET);
    const isSessionValid = await verifyAdminAuth(request);

    if (!isKeyValid && !isSessionValid) {
      return NextResponse.json(
        { success: false, error: "Accès diagnostic non autorisé. Jeton ou session requis." },
        { status: 401 }
      );
    }

    const rawProjectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "price-cfa";
    const rawClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
    const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    const normalizedKey = rawPrivateKey ? normalizePrivateKey(rawPrivateKey) : "";
    const isPemValid = Boolean(
      normalizedKey.includes("-----BEGIN PRIVATE KEY-----") &&
      normalizedKey.includes("-----END PRIVATE KEY-----") &&
      normalizedKey.length > 500
    );

    const app = getAdminApp();
    const adminDb = getAdminFirestore();
    let firestorePing: { ok: boolean; productsCount?: number; error?: string } = { ok: false };

    if (adminDb) {
      try {
        const snap = await adminDb.collection("products").limit(1).get();
        firestorePing = { ok: true, productsCount: snap.docs.length };
      } catch (err: any) {
        firestorePing = { ok: false, error: err?.message || String(err) };
      }
    } else {
      firestorePing = { ok: false, error: getAdminInitError() || "adminDb est null" };
    }

    const diagnostics = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      platform: process.platform,
      cwd: process.cwd(),
      envLoader: getEnvDiagnostics(),
      credentialsAudit: {
        FIREBASE_PROJECT_ID: {
          configured: Boolean(rawProjectId),
          value: rawProjectId
        },
        FIREBASE_CLIENT_EMAIL: {
          configured: Boolean(rawClientEmail),
          length: rawClientEmail ? rawClientEmail.length : 0,
          domain: rawClientEmail && rawClientEmail.includes("@") ? "@" + rawClientEmail.split("@")[1] : "non-email"
        },
        FIREBASE_PRIVATE_KEY: {
          configured: Boolean(rawPrivateKey),
          rawLength: rawPrivateKey ? rawPrivateKey.length : 0,
          normalizedLength: normalizedKey.length,
          hasBegin: normalizedKey.includes("-----BEGIN PRIVATE KEY-----"),
          hasEnd: normalizedKey.includes("-----END PRIVATE KEY-----"),
          lineCount: normalizedKey ? normalizedKey.split("\n").length : 0,
          isPemValid
        },
        FIREBASE_SERVICE_ACCOUNT_KEY: {
          configured: Boolean(rawServiceAccount),
          length: rawServiceAccount ? rawServiceAccount.length : 0
        },
        ADMIN_PASSWORD: {
          configured: Boolean(process.env.ADMIN_PASSWORD),
          length: process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.length : 0
        },
        ADMIN_JWT_SECRET: {
          configured: Boolean(process.env.ADMIN_JWT_SECRET),
          length: process.env.ADMIN_JWT_SECRET ? process.env.ADMIN_JWT_SECRET.length : 0
        }
      },
      firebaseAdmin: {
        appInitialized: Boolean(app),
        firestoreReady: Boolean(adminDb),
        initError: getAdminInitError()
      },
      firestorePing
    };

    return NextResponse.json({ success: true, diagnostics });
  } catch (error: any) {
    console.error("GET /api/admin/diagnostics error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erreur diagnostic" },
      { status: 500 }
    );
  }
}
