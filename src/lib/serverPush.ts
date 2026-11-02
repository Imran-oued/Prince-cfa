import webpush from "web-push";
import { VAPID_CONFIG } from "@/config/vapid";
import { getPushSubscriptions, removePushSubscription } from "@/lib/firestore";

// Initialiser VAPID pour l'envoi vers les serveurs Apple (web.push.apple.com) et Google (fcm.googleapis.com)
webpush.setVapidDetails(
  VAPID_CONFIG.subject,
  VAPID_CONFIG.publicKey,
  VAPID_CONFIG.privateKey
);

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  url?: string;
  orderId?: string;
  data?: {
    url?: string;
    orderId?: string;
    [key: string]: any;
  };
}

/**
 * Envoie une notification push serveur à tous les smartphones administrateurs enregistrés (iPhones, Android, etc.)
 */
export async function sendPushToAdmins(payload: PushNotificationPayload) {
  try {
    const subscriptions = await getPushSubscriptions();
    if (!subscriptions || subscriptions.length === 0) {
      return { success: true, count: 0 };
    }

    const jsonString = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || "/icon-192.png",
      badge: payload.badge || "/apple-touch-icon.png",
      tag: payload.tag || `order-${Date.now()}`,
      data: payload.data || { url: "/admin" }
    });

    const sendPromises = subscriptions.map(async (sub: any) => {
      try {
        await webpush.sendNotification(sub, jsonString, {
          TTL: 60 * 60 * 24, // 24h
          urgency: "high"
        });
        return { success: true, endpoint: sub.endpoint };
      } catch (err: any) {
        // Si l'abonnement a expiré ou a été désinstallé par l'utilisateur (HTTP 404 / 410)
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.warn("[Push] Abonnement expiré, nettoyage:", sub.endpoint);
          await removePushSubscription(sub.endpoint).catch(() => {});
        } else {
          console.error("[Push] Erreur envoi vers endpoint:", err.message || err);
        }
        return { success: false, endpoint: sub.endpoint, error: err };
      }
    });

    const results = await Promise.all(sendPromises);
    const sentCount = results.filter(r => r.success).length;
    return { success: true, count: sentCount, total: subscriptions.length };
  } catch (error) {
    console.error("[Push] Erreur globale sendPushToAdmins:", error);
    return { success: false, error };
  }
}
