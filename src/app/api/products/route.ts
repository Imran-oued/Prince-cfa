import { NextResponse } from "next/server";
import { getCachedProducts } from "@/lib/serverCache";

export async function GET() {
  try {
    const products = await getCachedProducts();

    return NextResponse.json(
      { success: true, products },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du chargement des produits." },
      { status: 500 }
    );
  }
}
