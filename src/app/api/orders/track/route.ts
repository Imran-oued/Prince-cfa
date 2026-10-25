import { NextResponse } from "next/server";
import { getOrderById, getOrders } from "@/lib/firestore";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getCachedOrders } from "@/lib/serverCache";

/**
 * Assainit et filtre les données sensibles pour la consultation publique
 * Protège les données personnelles (RGPD / vie privée)
 */
function sanitizePublicOrder(order: any, isPhoneVerified = false) {
  if (!order) return null;

  const rawPhone = order.customer?.phone || "";
  // Masquage du numéro : ex. 70 •••• 12
  const phoneMasked = rawPhone.length >= 4 
    ? rawPhone.replace(/(\d{2})(\d+)(\d{2})$/, "$1 •••• $3")
    : "••••••••";

  // Si le numéro a été vérifié par le demandeur, on peut afficher le prénom/nom,
  // sinon on masque le nom pour éviter l'exposition d'identité sur simple devinette d'ID
  const customerName = isPhoneVerified
    ? (order.customer?.name || "Client")
    : (order.customer?.name 
        ? order.customer.name.split(" ").map((w: string) => w.length > 1 ? `${w[0]}***` : w).join(" ")
        : "Client");

  return {
    id: order.id,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    orderStatus: order.orderStatus || "en_attente_paiement",
    customer: {
      name: customerName,
      deliveryMethod: order.customer?.deliveryMethod || "delivery",
      city: order.customer?.city || "Ouagadougou",
      neighborhood: isPhoneVerified ? (order.customer?.neighborhood || "") : "Zone réservée",
      phoneMasked
    },
    items: (order.items || []).map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      selectedCapacity: item.selectedCapacity || null,
      selectedColor: item.selectedColor || null,
      unitPrice: item.unitPrice,
      image: item.image || "https://placehold.co/600x600/121216/d4af37?text=PRINCE+CFA"
    })),
    pricing: {
      subtotal: order.pricing?.subtotal || 0,
      deliveryFee: order.pricing?.deliveryFee || 0,
      total: order.pricing?.total || 0,
      currency: order.pricing?.currency || "FCFA"
    },
    payment: {
      status: order.payment?.status || "en_attente",
      method: order.payment?.method || "orange_money",
      confirmedAt: order.payment?.confirmedAt || null
      // La référence interne et les détails de tracking (IMEI/SAV) sont STRICTEMENT exclus
    },
    statusHistory: (order.statusHistory || []).map((h: any) => ({
      status: h.status,
      timestamp: h.timestamp,
      note: h.note || ""
    }))
  };
}

function cleanDigits(val: string): string {
  return (val || "").replace(/\D+/g, "");
}

export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // 1. Limitation de débit anti-scraping : Max 20 requêtes par minute par IP
    const rateCheck = checkRateLimit(`track:${clientIp}`, {
      intervalMs: 60 * 1000,
      maxRequests: 20
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Trop de requêtes de suivi. Veuillez patienter une minute avant de réessayer." 
        },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id")?.trim() || "";
    const phone = searchParams.get("phone")?.trim() || "";
    const query = searchParams.get("q")?.trim() || searchParams.get("query")?.trim() || "";

    const term = orderId || phone || query;
    if (!term) {
      return NextResponse.json(
        { success: false, error: "Veuillez renseigner votre référence de commande ou numéro de téléphone." },
        { status: 400 }
      );
    }

    // 2. Recherche directe par référence de commande (ex: CMD-20261023-XXXX)
    if (orderId && orderId.toUpperCase().startsWith("CMD")) {
      const order = await getOrderById(orderId);
      if (order) {
        let isPhoneVerified = false;
        if (phone) {
          const clientDigits = cleanDigits(phone);
          const orderDigits = cleanDigits(order.customer?.phone || "");
          if (clientDigits && orderDigits) {
            if (!orderDigits.endsWith(clientDigits) && !clientDigits.endsWith(orderDigits)) {
              return NextResponse.json(
                { success: false, error: "Le numéro de téléphone ne correspond pas à cette référence de commande." },
                { status: 403 }
              );
            }
            isPhoneVerified = true;
          }
        }
        return NextResponse.json({ 
          success: true, 
          order: sanitizePublicOrder(order, isPhoneVerified) 
        });
      }
    }

    // 3. Recherche par numéro de téléphone (au moins 8 chiffres requis pour éviter les collisions massives)
    const phoneCandidate = phone || (cleanDigits(orderId).length >= 8 ? orderId : "") || (cleanDigits(query).length >= 8 ? query : "");
    if (phoneCandidate) {
      const searchDigits = cleanDigits(phoneCandidate);
      if (searchDigits.length < 8) {
        return NextResponse.json(
          { success: false, error: "Un numéro de téléphone complet d'au moins 8 chiffres est requis pour la recherche." },
          { status: 400 }
        );
      }

      const allOrders = await getCachedOrders();
      const matching = (allOrders || []).filter((o: any) => {
        const orderPhoneDigits = cleanDigits(o.customer?.phone || "");
        return orderPhoneDigits && (orderPhoneDigits.endsWith(searchDigits) || searchDigits.endsWith(orderPhoneDigits));
      });

      if (matching.length === 0) {
        return NextResponse.json(
          { success: false, error: `Aucune commande trouvée pour le numéro indiqué. Vérifiez votre saisie.` },
          { status: 404 }
        );
      }

      // Trier de la plus récente à la plus ancienne
      matching.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return NextResponse.json({
        success: true,
        order: sanitizePublicOrder(matching[0], true),
        orders: matching.map((o: any) => sanitizePublicOrder(o, true)),
        totalFound: matching.length
      });
    }

    // 4. Recherche par ID exact sans préfixe
    if (orderId) {
      const order = await getOrderById(orderId);
      if (order) {
        return NextResponse.json({ 
          success: true, 
          order: sanitizePublicOrder(order, false) 
        });
      }
    }

    return NextResponse.json(
      { success: false, error: "Commande introuvable. Vérifiez votre référence ou votre numéro de téléphone." },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Erreur API track order:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur lors de la recherche de la commande." },
      { status: 500 }
    );
  }
}
