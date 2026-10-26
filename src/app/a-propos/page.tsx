import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Crown, ArrowLeft, ArrowRight, Store, Clock } from "lucide-react";
import { SHOP_CONFIG } from "@/config/shop";

export const metadata: Metadata = {
  title: "À Propos & L'Histoire | PRINCE CFA",
  description: "À Propos et l'histoire de la Maison PRINCE CFA à Ouagadougou, Burkina Faso.",
};

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col selection:bg-gold selection:text-black">
      {/* Header Sticky Haut de Gamme */}
      <header className="sticky top-0 z-40 glass-panel border-b border-gold/15 px-4 py-3 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(212,175,55,0.3)]">
              <Image
                src="/logo.jpeg"
                alt="Logo Prince CFA"
                fill
                sizes="(max-width: 640px) 48px, 56px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-lg tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-yellow-500">
                PRINCE <span className="text-white">CFA</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 group-hover:text-gold transition-colors">
                Maison de Prestige
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="text-xs px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white border border-white/10 transition-colors flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              <span>Boutique</span>
            </Link>

            <a
              href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=Bonjour%20Prince%20CFA`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex text-xs px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-semibold items-center gap-1.5 transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Assistance VIP</span>
            </a>
          </div>
        </div>
      </header>

      {/* Contenu Principal Épuré (En attente de la rédaction ultérieure) */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-16 sm:py-24 flex flex-col items-center justify-center text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest">
          <Crown className="w-4 h-4 text-gold" aria-hidden="true" />
          <span>Maison PRINCE CFA • Koulouba, Ouagadougou</span>
        </div>

        <div className="space-y-4 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            À Propos • <span className="text-gold">L&apos;Histoire PRINCE CFA</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Cette section est actuellement réservée. L&apos;histoire officielle et la présentation détaillée de notre Maison à Ouagadougou seront publiées ici lors d&apos;une prochaine mise à jour.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 max-w-md w-full space-y-4 text-xs text-zinc-400">
          <div className="flex items-center justify-center gap-2 text-gold font-bold uppercase tracking-wider text-[11px]">
            <Store className="w-4 h-4" />
            <span>Showroom Ouagadougou</span>
          </div>
          <p className="leading-relaxed">
            Notre showroom physique reste ouvert à Koulouba pour vous accueillir, découvrir nos collections et essayer nos équipements.
          </p>
          <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
            <Clock className="w-3.5 h-3.5 text-gold" />
            <span>Du Lundi au Samedi (9h - 19h) • Dimanche (10h - 16h)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-gold text-black font-extrabold text-xs uppercase tracking-wider hover:bg-gold-hover transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>Retour à la Boutique</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=Bonjour%20Prince%20CFA`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all inline-flex items-center gap-2"
          >
            <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
            <span>Contact Conciergerie</span>
          </a>
        </div>

      </main>

      {/* Footer Minimaliste & Épuré */}
      <footer className="border-t border-white/10 bg-[#060608] py-8 px-4 sm:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 PRINCE CFA. Koulouba, Ouagadougou. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-zinc-400">
            <Link href="/" className="hover:text-gold transition-colors">Accueil</Link>
            <span>•</span>
            <Link href="/a-propos" className="text-gold font-semibold hover:underline">À Propos</Link>
            <span>•</span>
            <Link href="/mentions-legales" className="hover:text-gold transition-colors">Mentions Légales</Link>
            <span>•</span>
            <Link href="/politique-de-confidentialite" className="hover:text-gold transition-colors">Politique de Confidentialité</Link>
            <span>•</span>
            <Link href="/suivi" className="hover:text-gold transition-colors">Suivi Commande</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
