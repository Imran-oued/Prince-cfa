// Service Worker officiel Prince CFA Admin pour les notifications push
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Écoute de l'événement push déclenché par le serveur (APNs pour iOS, FCM pour Android)
self.addEventListener("push", (event) => {
  let payload = {
    title: "🔔 Nouvelle commande Prince CFA !",
    body: "Une nouvelle commande vient d'être enregistrée sur la boutique.",
    data: { url: "/admin" }
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const title = payload.title || "🔔 Nouvelle commande Prince CFA !";
  const options = {
    body: payload.body || "Nouvelle commande reçue.",
    icon: payload.icon || "/icon-192.png",
    badge: payload.badge || "/apple-touch-icon.png",
    tag: payload.tag || `order-${Date.now()}`,
    vibrate: [300, 150, 300, 150, 500],
    requireInteraction: true,
    data: payload.data || { url: "/admin" }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Clic sur la notification -> ouvre ou bascule vers /admin
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/admin";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && client.url.includes("/admin") && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
