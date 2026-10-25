import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import { getProducts, addProduct } from "@/lib/firestore";
import { validateAndCleanProduct } from "@/lib/productValidation";
import { invalidateProductsCache } from "@/lib/serverCache";

export async function GET(request: Request) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Accès refusé. Session administrateur requise." },
        { status: 401 }
      );
    }

    const products = await getProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des produits." },
      { status: 500 }
    );
  }
}

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
    
    // 1. Validation stricte des données selon la catégorie
    const validation = validateAndCleanProduct(body);
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

    // 2. Persistance sécurisée dans Firestore
    const cleaned = validation.cleanedProduct;
    const docId = await addProduct(cleaned);

    // Invalider le cache mémoire catalogue
    invalidateProductsCache();

    return NextResponse.json({
      success: true,
      productId: docId || cleaned.id,
      product: { ...cleaned, id: docId || cleaned.id },
    }, { status: 201 });

  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'enregistrement du produit." },
      { status: 500 }
    );
  }
}
