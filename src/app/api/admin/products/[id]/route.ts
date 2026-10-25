import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import { updateProduct, deleteProduct, getProduct } from "@/lib/firestore";
import { validateAndCleanProduct } from "@/lib/productValidation";
import { invalidateProductsCache } from "@/lib/serverCache";

export async function PUT(
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
        { success: false, error: "Identifiant de produit manquant." },
        { status: 400 }
      );
    }

    const body = await request.json();

    // 1. Validation stricte des données du produit mis à jour
    const validation = validateAndCleanProduct({ ...body, id });
    if (!validation.valid || !validation.cleanedProduct) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Certaines données sont invalides.", 
          errors: validation.errors 
        },
        { status: 400 }
      );
    }

    const cleaned = validation.cleanedProduct;

    // 2. Mise à jour dans Firestore
    const updated = await updateProduct(id, cleaned);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Impossible de mettre à jour le produit dans Firestore." },
        { status: 500 }
      );
    }

    // Invalider le cache mémoire catalogue
    invalidateProductsCache();

    return NextResponse.json({
      success: true,
      product: cleaned,
    });

  } catch (error) {
    console.error("PUT /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur lors de la mise à jour." },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
        { success: false, error: "Identifiant de produit manquant." },
        { status: 400 }
      );
    }

    const deleted = await deleteProduct(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Échec de la suppression dans Firestore." },
        { status: 500 }
      );
    }

    // Invalider le cache mémoire catalogue
    invalidateProductsCache();

    return NextResponse.json({ success: true, message: "Produit supprimé avec succès." });

  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur lors de la suppression." },
      { status: 500 }
    );
  }
}
