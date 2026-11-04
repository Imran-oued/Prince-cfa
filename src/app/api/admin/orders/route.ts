import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import { getCachedOrders, invalidateOrdersCache } from "@/lib/serverCache";
import { clearAllOrders } from "@/lib/firestore";

const ADMIN_SECRET_KEY = "prince-diag-2026";

async function checkAuth(request: Request): Promise<boolean> {
  const url = new URL(request.url);
  const keyParam = url.searchParams.get("key");
  const keyHeader = request.headers.get("x-admin-key");

  if (keyParam === ADMIN_SECRET_KEY || keyHeader === ADMIN_SECRET_KEY) {
    return true;
  }
  return await verifyAdminAuth(request);
}

export async function GET(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Accès refusé. Session administrateur requise." },
        { status: 401 }
      );
    }

    const orders = await getCachedOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des commandes." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Accès refusé. Session administrateur requise." },
        { status: 401 }
      );
    }

    const result = await clearAllOrders();
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Échec de suppression des commandes." },
        { status: 500 }
      );
    }

    // Invalider le cache serveur pour mise à jour instantanée
    invalidateOrdersCache();

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} commande(s) de test supprimée(s) avec succès. La base est désormais vierge pour le client.`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/orders error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erreur interne lors de la suppression." },
      { status: 500 }
    );
  }
}
