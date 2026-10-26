import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import { getCachedOrders } from "@/lib/serverCache";

export async function GET(request: Request) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
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
