import { NextResponse } from "next/server";
import { SHOP_CONFIG } from "@/config/shop";
import { createOrder, checkAndReserveStock } from "@/lib/firestore";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, paymentMethod, transactionRef } = body;

    // 1. Validation de base
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

    const validMethods = ["orange_money", "wave", "store_pickup"];
    const selectedMethod = validMethods.includes(paymentMethod) ? paymentMethod : "orange_money";

    // 2. Calcul des montants côté serveur (sécurité anti-falsification)
    let subtotal = 0;
    const sanitizedItems = items.map((item: OrderItemInput) => {
      const unitPrice = Math.max(0, Number(item.price) || 0);
      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
      subtotal += unitPrice * qty;

      return {
        productId: item.productId || item.id || "product",
        name: String(item.name || "Produit"),
        unitPrice,
        quantity: qty,
        selectedCapacity: item.selectedCapacity || null,
        selectedColor: item.selectedColor || null,
        image: item.image || "https://placehold.co/600x600/121216/d4af37?text=PRINCE+CFA"
      };
    });

    const isDelivery = customer.deliveryMethod === "delivery";
    const deliveryFee = isDelivery ? SHOP_CONFIG.deliveryFee : 0;
    const total = subtotal + deliveryFee;

    // 3. Contrôle & réservation du stock
    const stockResult = await checkAndReserveStock(sanitizedItems);
    if (!stockResult.success) {
      return NextResponse.json(
        { success: false, error: stockResult.error || "Stock insuffisant." },
        { status: 409 }
      );
    }

    // 4. Informations du moyen de paiement configuré
    const paymentMethods = SHOP_CONFIG.paymentMethods as Record<string, PaymentConfig>;
    const paymentConfig = paymentMethods[selectedMethod] || SHOP_CONFIG.paymentMethods.orange_money;

    const orderPayload = {
      customer: {
        name: customer.name.trim(),
        phone: cleanPhone,
        deliveryMethod: isDelivery ? "delivery" : "pickup",
        city: customer.city?.trim() || (isDelivery ? "Ouagadougou" : "Showroom"),
        neighborhood: customer.neighborhood?.trim() || "",
        notes: customer.notes?.trim() || ""
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
        status: "en_attente", // RÈGLE ABSOLUE : Toujours en attente
        confirmedAt: null,
        confirmedBy: null,
        transactionRef: transactionRef ? String(transactionRef).trim() : null
      }
    };

    const result = await createOrder(orderPayload);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Échec d'enregistrement de la commande." },
        { status: 500 }
      );
    }

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
