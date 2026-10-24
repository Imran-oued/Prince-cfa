import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";


export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin";

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: "Mot de passe administrateur incorrect." },
        { status: 401 }
      );
    }

    const token = generateAdminToken();
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/"
    });

    return NextResponse.json({
      success: true,
      token,
      message: "Connexion administrateur réussie."
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'authentification." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
    return NextResponse.json({ success: true, message: "Déconnexion réussie." });
  } catch {
    return NextResponse.json({ success: true });
  }
}
