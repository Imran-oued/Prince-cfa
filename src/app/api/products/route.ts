import { NextResponse } from "next/server";
import { getCachedProductsJson } from "@/lib/serverCache";

export async function GET(request: Request) {
  try {
    const { jsonString, etag } = await getCachedProductsJson();

    // Réponse directe du buffer mémoire pré-sérialisé (ZÉRO coût CPU JSON.stringify sur l'Event Loop)
    // Toujours renvoyer 200 avec headers anti-cache pour garantir que les clients ont la version la plus fraîche sans blocage 304
    return new Response(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "ETag": etag,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
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
