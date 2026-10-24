import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import { 
  getOrderById, 
  confirmOrderPayment, 
  updateOrderStatus, 
  restoreStock,
  updateOrderInternalTracking
} from "@/lib/firestore";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Accès refusé. Session administrateur requise." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Identifiant de commande manquant." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === "confirm_payment") {
      const { confirmedBy, transactionRef, note } = body;
      if (!confirmedBy?.trim()) {
        return NextResponse.json(
          { success: false, error: "Le nom ou matricule de l'administrateur ayant vérifié le paiement est obligatoire." },
          { status: 400 }
        );
      }

      const result = await confirmOrderPayment(id, {
        confirmedBy: confirmedBy.trim(),
        transactionRef: transactionRef?.trim() || null,
        note: note?.trim() || ""
      });

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }

      return NextResponse.json({ success: true, order: result.order });
    }

    if (action === "update_status") {
      const { newStatus, adminUser, note } = body;
      const validStatuses = [
        "en_attente_paiement",
        "paye_en_preparation",
        "en_livraison",
        "livre",
        "annule"
      ];

      if (!validStatuses.includes(newStatus)) {
        return NextResponse.json(
          { success: false, error: `Statut invalide: "${newStatus}".` },
          { status: 400 }
        );
      }

      // Si annulation, restituer les stocks
      if (newStatus === "annule") {
        const currentOrder = await getOrderById(id);
        if (currentOrder && currentOrder.orderStatus !== "annule" && currentOrder.items) {
          await restoreStock(currentOrder.items);
        }
      }

      const result = await updateOrderStatus(id, newStatus, adminUser || "Admin Prince CFA", note);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }

      return NextResponse.json({ success: true, order: result.order });
    }

    if (action === "update_internal_tracking") {
      const { imei, serialNumber, internalNote, adminUser } = body;
      const result = await updateOrderInternalTracking(id, {
        imei,
        serialNumber,
        internalNote,
        adminUser: adminUser || "Admin Prince CFA"
      });

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }

      return NextResponse.json({ success: true, order: result.order });
    }

    return NextResponse.json(
      { success: false, error: "Action non reconnue. Utilisez 'confirm_payment', 'update_status' ou 'update_internal_tracking'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("PATCH /api/admin/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne lors de la mise à jour de la commande." },
      { status: 500 }
    );
  }
}
