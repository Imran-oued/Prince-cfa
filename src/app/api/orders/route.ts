import { NextResponse } from "next/server";
import { SHOP_CONFIG } from "@/config/shop";
import { createOrder, checkAndReserveStock, getProduct, getProducts } from "@/lib/firestore";
import { products as defaultProducts } from "@/data/products";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getCachedProducts, invalidateOrdersCache } from "@/lib/serverCache";

interface OrderItemInput {
  productId?: string | number;
  id?: string | number;
  name?: string;
  price?: number;
  quantity?: number;
  selectedCapacity?: string | null;
  selectedColor?: string | null;
  image?: string;
}

interface PaymentConfig {
  id?: string;
  name?: string;
  displayNumber?: string;
  number?: string;
  instructions?: string;
  recipientName?: string;
}

/**
 * Nettoyage des chaînes textuelles pour neutraliser toute injection XSS
 */
function sanitizeText(str: any, maxLen = 250): string {
  if (!str || typeof str !== "string") return "";
  return str.replace(/[<>]/g, "").trim().slice(0, maxLen);
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // 1. Protection Anti-Abus / Anti-DoS : Max 15 commandes par 10 minutes par adresse IP
    const rateCheck = checkRateLimit(`order_create:${clientIp}`, {
      intervalMs: 10 * 60 * 1000,
      maxRequests: 15
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Trop de requêtes de commande. Veuillez patienter quelques instants avant de renouveler votre commande." 
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { customer, items, paymentMethod, transactionRef } = body;

    // 2. Validation stricte des données client
    if (!customer || !customer.name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Le nom du client est obligatoire." },
        { status: 400 }
      );
    }

    const cleanPhone = (customer.phone || "").replace(/\s+/g, "");
    if (!cleanPhone || cleanPhone.length < 8) {
      return NextResponse.json(
        { success: false, error: "Un numéro de téléphone valide (au moins 8 chiffres) est obligatoire." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Le panier ne peut pas être vide." },
        { status: 400 }
      );
    }

    // Bloquer les paniers démesurés (anti-DoS / memory exhaustion)
    if (items.length > 50) {
      return NextResponse.json(
        { success: false, error: "Le panier dépasse la limite autorisée de 50 articles." },
        { status: 400 }
      );
    }

    const validMethods = ["orange_money", "wave", "store_pickup"];
    const selectedMethod = validMethods.includes(paymentMethod) ? paymentMethod : "orange_money";

    // 3. Récupération du catalogue de référence avec cache mémoire serveur (zéro appel Firestore inutile)
    let cloudProducts: any[] | null = null;
    try {
      cloudProducts = await getCachedProducts();
    } catch {
      // Repli sur le catalogue statique si indisponible
    }

    // 4. Calcul et certification des montants côté serveur (SÉCURITÉ ANTI-FALSIFICATION DES PRIX)
    let subtotal = 0;
    const sanitizedItems = [];

    for (const item of items as OrderItemInput[]) {
      const rawProductId = String(item.productId || item.id || "");
      const qty = Math.max(1, Math.min(100, Math.floor(Number(item.quantity) || 1)));

      // Recherche du produit officiel dans le catalogue serveur (Firestore puis catalogue par défaut)
      let authenticProduct: any = null;
      if (cloudProducts && cloudProducts.length > 0) {
        authenticProduct = cloudProducts.find(p => String(p.id) === rawProductId);
      }
      if (!authenticProduct) {
        authenticProduct = defaultProducts.find(p => String(p.id) === rawProductId);
      }

      let authenticUnitPrice = 0;
      let authenticName = sanitizeText(item.name || "Article", 120);
      let authenticImage = item.image || "https://placehold.co/600x600/121216/d4af37?text=PRINCE+CFA";

      if (authenticProduct) {
        authenticName = authenticProduct.name;
        authenticImage = authenticProduct.image || authenticImage;
        authenticUnitPrice = Number(authenticProduct.salePrice || authenticProduct.price || 0);

        // Si le client a sélectionné une capacité spécifique (ex: 256 Go, 512 Go)
        if (item.selectedCapacity && authenticProduct.storageOptions && Array.isArray(authenticProduct.storageOptions)) {
          const matchedOpt = authenticProduct.storageOptions.find(
            (opt: any) => opt.capacity?.trim().toLowerCase() === String(item.selectedCapacity).trim().toLowerCase()
          );
          if (matchedOpt && Number(matchedOpt.price) > 0) {
            authenticUnitPrice = Number(matchedOpt.price);
          }
        }
      } else {
        // Si le produit n'est pas trouvé dans le catalogue officiel (produit dynamique ou ancien),
        // vérifier que le prix fourni est cohérent et positif
        authenticUnitPrice = Math.max(0, Number(item.price) || 0);
      }

      subtotal += authenticUnitPrice * qty;

      sanitizedItems.push({
        productId: rawProductId || "product",
        name: authenticName,
        unitPrice: authenticUnitPrice,
        quantity: qty,
        selectedCapacity: item.selectedCapacity ? sanitizeText(item.selectedCapacity, 30) : null,
        selectedColor: item.selectedColor ? sanitizeText(item.selectedColor, 40) : null,
        image: authenticImage
      });
    }

    const isDelivery = customer.deliveryMethod === "delivery";
    const deliveryFee = isDelivery ? SHOP_CONFIG.deliveryFee : 0;
    const total = subtotal + deliveryFee;

    // 5. Contrôle & réservation du stock
    const stockResult = await checkAndReserveStock(sanitizedItems);
    if (!stockResult.success) {
      return NextResponse.json(
        { success: false, error: stockResult.error || "Stock insuffisant." },
        { status: 409 }
      );
    }

    // 6. Informations du moyen de paiement configuré
    const paymentMethods = SHOP_CONFIG.paymentMethods as Record<string, PaymentConfig>;
    const paymentConfig = paymentMethods[selectedMethod] || SHOP_CONFIG.paymentMethods.orange_money;

    const orderPayload = {
      customer: {
        name: sanitizeText(customer.name, 100),
        phone: cleanPhone,
        deliveryMethod: isDelivery ? "delivery" : "pickup",
        city: sanitizeText(customer.city || (isDelivery ? "Ouagadougou" : "Boutique"), 80),
        neighborhood: sanitizeText(customer.neighborhood || "", 120),
        notes: sanitizeText(customer.notes || "", 300)
      },
      items: sanitizedItems,
      pricing: {
        subtotal,
        deliveryFee,
        total,
        currency: SHOP_CONFIG.currency
      },
      payment: {
        method: selectedMethod,
        expectedAmount: total,
        merchantNumber: paymentConfig.displayNumber || SHOP_CONFIG.displayPhone,
        status: "en_attente", // RÈGLE ABSOLUE : Toujours en attente à la création
        confirmedAt: null,
        confirmedBy: null,
        transactionRef: transactionRef ? sanitizeText(String(transactionRef), 80) : null
      }
    };

    const result = await createOrder(orderPayload);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Échec d'enregistrement de la commande." },
        { status: 500 }
      );
    }

    // Invalider le cache des commandes pour mise à jour instantanée du suivi
    invalidateOrdersCache();

    return NextResponse.json(
      { 
        success: true, 
        orderId: result.order.id, 
        order: result.order 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Orders error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur lors de la commande." },
      { status: 500 }
    );
  }
}
