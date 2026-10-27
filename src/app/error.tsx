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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full glass-panel border border-gold/30 rounded-3xl p-6 sm:p-8 text-center shadow-lg backdrop-blur-xl bg-white">
        <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/40 flex items-center justify-center mx-auto mb-5 text-gold shadow-sm">
          <AlertTriangle className="w-8 h-8 text-gold" aria-hidden="true" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-zinc-950 uppercase tracking-wider mb-2">
          Chargement Interrompu
        </h1>

        <p className="text-xs sm:text-sm text-zinc-600 mb-6 leading-relaxed">
          Un imprévu technique temporaire est survenu lors de l&apos;affichage de la boutique. Cliquez ci-dessous pour recharger immédiatement.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold via-yellow-500 to-yellow-600 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réessayer</span>
          </button>

          <button
            onClick={handleClearCacheAndReload}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
            <span>Vider le cache local & Actualiser</span>
          </button>

          <div className="pt-2 border-t border-zinc-200 flex items-center justify-center gap-4 text-xs text-zinc-500">
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
