import { NextResponse } from "next/server";
import webpush from "web-push";
import { VAPID_CONFIG } from "@/config/vapid";
import { savePushSubscription, removePushSubscription } from "@/lib/firestore";
import { verifyAdminAuth } from "@/lib/auth";

// Initialisation VAPID
if (VAPID_CONFIG.publicKey && VAPID_CONFIG.privateKey) {
  try {
    webpush.setVapidDetails(
      VAPID_CONFIG.subject,
      VAPID_CONFIG.publicKey,
      VAPID_CONFIG.privateKey
    );
  } catch (err) {
    console.warn("[push-subscription] Avertissement initialisation VAPID:", err);
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    publicKey: VAPID_CONFIG.publicKey
  });
}

export async function POST(request: Request) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Accès refusé. Session administrateur requise." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subscription } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { success: false, error: "Abonnement push invalide." },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") || "";
    const saved = await savePushSubscription(subscription, userAgent);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Échec de l'enregistrement de l'abonnement." },
        { status: 500 }
      );
    }

    // Envoi immédiat d'une notification de confirmation de bienvenue sur le smartphone
    try {
      const welcomePayload = JSON.stringify({
        title: "👑 Prince CFA Admin",
        body: "Notifications Push actives sur cet appareil ! Vous recevrez une alerte pour chaque nouvelle commande même écran éteint.",
        icon: "/icon-192.png",
        badge: "/apple-touch-icon.png",
        tag: "welcome-push",
        data: { url: "/admin" }
      });

      await webpush.sendNotification(subscription, welcomePayload, {
        TTL: 60,
        urgency: "high"
      });
    } catch (pushErr: any) {
      console.warn("[Push] Note lors de l'envoi de bienvenue:", pushErr?.message || pushErr);
    }

    return NextResponse.json({
      success: true,
      message: "Abonnement push enregistré avec succès."
    });
  } catch (error) {
    console.error("POST /api/admin/push-subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur lors de l'enregistrement push." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Accès refusé. Session administrateur requise." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: "Endpoint manquant." },
        { status: 400 }
      );
    }

    await removePushSubscription(endpoint);
    return NextResponse.json({ success: true, message: "Abonnement supprimé." });
  } catch (error) {
    console.error("DELETE /api/admin/push-subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur lors de la suppression." },
      { status: 500 }
    );
  }
}

