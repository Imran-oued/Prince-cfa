import { NextResponse } from "next/server";
import { getCachedProductsJson } from "@/lib/serverCache";

export async function GET(request: Request) {
  try {
    const { jsonString, etag } = await getCachedProductsJson();

    // 1. Validation ETag conditionnelle (If-None-Match) pour éliminer les transferts réseau inutiles
    const clientEtag = request.headers.get("if-none-match");
    if (clientEtag && clientEtag === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          "ETag": etag,
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      });
    }

    // 2. Réponse directe du buffer mémoire pré-sérialisé (ZÉRO coût CPU JSON.stringify sur l'Event Loop)
    return new Response(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "ETag": etag,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du chargement des produits." },
      { status: 500 }
    );
  }
}
