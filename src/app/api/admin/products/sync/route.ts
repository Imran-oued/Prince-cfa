import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import { seedProducts, getProducts } from "@/lib/firestore";
import { invalidateProductsCache } from "@/lib/serverCache";

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
    const productsToSync = body.products;

    if (!Array.isArray(productsToSync) || productsToSync.length === 0) {
      return NextResponse.json(
        { success: false, error: "Liste de produits invalide ou vide." },
        { status: 400 }
      );
    }

    const success = await seedProducts(productsToSync);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Erreur lors de la synchronisation Firestore." },
        { status: 500 }
      );
    }

    invalidateProductsCache();
    const refreshed = await getProducts();

    return NextResponse.json({
      success: true,
      message: `${productsToSync.length} produits synchronisés avec succès.`,
      products: refreshed,
    });
  } catch (error) {
    console.error("POST /api/admin/products/sync error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur lors de la synchronisation." },
      { status: 500 }
    );
  }
}
