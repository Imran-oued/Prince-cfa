import { NextResponse } from "next/server";
import { getOrderById, getOrders } from "@/lib/firestore";

function sanitizePublicOrder(order: any) {
  if (!order) return null;

  return {
    id: order.id,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    orderStatus: order.orderStatus || "en_attente_paiement",
    customer: {
      name: order.customer?.name || "Client",
      deliveryMethod: order.customer?.deliveryMethod || "delivery",
      city: order.customer?.city || "Ouagadougou",
      neighborhood: order.customer?.neighborhood || "",
      // Masquer partiellement le numéro pour préserver la vie privée en consultation publique
      phoneMasked: order.customer?.phone
        ? order.customer.phone.replace(/(\d{2})(\d+)(\d{2})/, "$1 •••• $3")
        : ""
    },
    items: (order.items || []).map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      selectedCapacity: item.selectedCapacity || null,
      selectedColor: item.selectedColor || null,
      unitPrice: item.unitPrice,
      image: item.image || "/images/placeholder.png"
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
      confirmedAt: order.payment?.confirmedAt || null,
      transactionRef: order.payment?.transactionRef || null
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

    // 1. Recherche directe par identifiant exact de commande (ex: CMD-20261023-XXXX)
    if (orderId && !cleanDigits(orderId).startsWith(orderId)) {
      const order = await getOrderById(orderId);
      if (order) {
        if (phone) {
          const clientDigits = cleanDigits(phone);
          const orderDigits = cleanDigits(order.customer?.phone || "");
          if (clientDigits && orderDigits && !orderDigits.endsWith(clientDigits) && !clientDigits.endsWith(orderDigits)) {
            return NextResponse.json(
              { success: false, error: "Le numéro de téléphone ne correspond pas à cette référence de commande." },
              { status: 403 }
            );
          }
        }
        return NextResponse.json({ success: true, order: sanitizePublicOrder(order) });
      }
    } else if (orderId) {
      // Si l'orderId ressemble à un identifiant exact, essayons d'abord getOrderById
      const order = await getOrderById(orderId);
      if (order) {
        return NextResponse.json({ success: true, order: sanitizePublicOrder(order) });
      }
    }

    // 2. Recherche par numéro de téléphone (soit via le paramètre phone, soit orderId/query contenant des chiffres)
    const phoneCandidate = phone || (cleanDigits(orderId).length >= 6 ? orderId : "") || (cleanDigits(query).length >= 6 ? query : "");
    if (phoneCandidate) {
      const searchDigits = cleanDigits(phoneCandidate);
      if (searchDigits.length < 6) {
        return NextResponse.json(
          { success: false, error: "Veuillez entrer un numéro de téléphone valide (au moins 8 chiffres)." },
          { status: 400 }
        );
      }

      const allOrders = await getOrders();
      const matching = (allOrders || []).filter((o: any) => {
        const orderPhoneDigits = cleanDigits(o.customer?.phone || "");
        return orderPhoneDigits && (orderPhoneDigits.endsWith(searchDigits) || searchDigits.endsWith(orderPhoneDigits));
      });

      if (matching.length === 0) {
        return NextResponse.json(
          { success: false, error: `Aucune commande trouvée pour le numéro ${phoneCandidate}. Vérifiez votre saisie.` },
          { status: 404 }
        );
      }

      // Trier de la plus récente à la plus ancienne
      matching.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return NextResponse.json({
        success: true,
        order: sanitizePublicOrder(matching[0]),
        orders: matching.map(sanitizePublicOrder),
        totalFound: matching.length
      });
    }

    // 3. Dernier recours : tenter une recherche insensible à la casse sur l'ID dans la liste globale
    const allOrders = await getOrders();
    const matchById = (allOrders || []).find((o: any) => 
      o.id && o.id.toLowerCase() === term.toLowerCase()
    );

    if (matchById) {
      return NextResponse.json({ success: true, order: sanitizePublicOrder(matchById) });
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
