"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Trash2, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur d'affichage de la page:", error);
  }, [error]);

  const handleClearCacheAndReload = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("prince_cfa_products");
        sessionStorage.clear();
      }
    } catch (e) {
      console.warn("Nettoyage stockage:", e);
    }
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full glass-panel border border-gold/30 rounded-3xl p-6 sm:p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/40 flex items-center justify-center mx-auto mb-5 text-gold shadow-[0_0_20px_rgba(212,175,55,0.25)]">
          <AlertTriangle className="w-8 h-8 text-gold" aria-hidden="true" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider mb-2">
          Chargement Interrompu
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
          Un imprévu technique temporaire est survenu lors de l&apos;affichage de la boutique. Cliquez ci-dessous pour recharger immédiatement.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold via-yellow-500 to-yellow-600 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réessayer</span>
          </button>

          <button
            onClick={handleClearCacheAndReload}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 text-zinc-300 hover:text-white font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Vider le cache local & Actualiser</span>
          </button>

          <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-4 text-xs text-zinc-400">
            <Link href="/" className="hover:text-gold transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Accueil</span>
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-gold transition-colors">
              Espace Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
