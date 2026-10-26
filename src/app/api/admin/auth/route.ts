import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateAdminToken, verifyAdminPassword, verifyAdminAuth, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    
    // Protection anti-brute force : Max 5 tentatives par tranche de 15 minutes par IP
    const rateCheck = checkRateLimit(`auth:${clientIp}`, {
      intervalMs: 15 * 60 * 1000,
      maxRequests: 5
    });

    if (!rateCheck.success) {
      const waitMinutes = Math.ceil((rateCheck.resetTime - Date.now()) / 60000);
      return NextResponse.json(
        { 
          success: false, 
          error: `Trop de tentatives infructueuses. Pour votre sécurité, veuillez patienter ${waitMinutes} minute(s) avant de réessayer.` 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateCheck.resetTime - Date.now()) / 1000))
          }
        }
      );
    }

    const { password } = await request.json();

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Mot de passe administrateur incorrect.",
          remainingAttempts: rateCheck.remaining
        },
        { status: 401 }
      );
    }

    // Génération d'un token HMAC-SHA256 sécurisé avec expiration 24h
    const token = generateAdminToken();
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 heures
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

export async function GET(request: Request) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value || "";
    return NextResponse.json({ authenticated: true, token });
  } catch (error) {
    console.error("GET /api/admin/auth error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
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
