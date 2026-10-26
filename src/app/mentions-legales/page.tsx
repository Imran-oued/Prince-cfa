import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  Building2, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Server, 
  Scale, 
  ArrowLeft, 
  Lock, 
  CreditCard, 
  Clock, 
  ExternalLink 
} from "lucide-react";
import { SHOP_CONFIG } from "@/config/shop";

export const metadata: Metadata = {
  title: "Mentions Légales | PRINCE CFA",
  description: "Mentions légales officielles et informations réglementaires de la boutique PRINCE CFA à Ouagadougou, Burkina Faso.",
};

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col selection:bg-gold selection:text-black">
      {/* Barre de Navigation Supérieure */}
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
              <span>Retour Boutique</span>
            </Link>

            <a
              href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=Bonjour%20Prince%20CFA,%20j'ai%20une%20question%20juridique%20ou%20administrative`}
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

      {/* Contenu Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-10">
        
        {/* En-tête / Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest">
            <Scale className="w-4 h-4 text-gold" aria-hidden="true" />
            <span>Cadre Légal & Réglementaire</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Mentions <span className="text-gold">Légales</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Conformément aux exigences légales et à notre engagement de transparence, retrouvez ci-dessous l&apos;ensemble des informations relatives à l&apos;éditeur de la boutique en ligne <strong>PRINCE CFA</strong>.
          </p>
          <div className="pt-2 text-[11px] text-zinc-500 flex items-center justify-center gap-2">
            <span>Dernière mise à jour : Février 2026</span>
            <span>•</span>
            <span className="text-gold font-semibold">Ouagadougou, Burkina Faso</span>
          </div>
        </div>

        {/* Grille des Cartes d'Informations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Carte 1 : Éditeur du Site */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-gold/30 transition-all space-y-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Building2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">1. Éditeur de la Plateforme</h2>
              <p className="text-xs text-zinc-400 mt-1">Identité de l&apos;entité exploitante</p>
            </div>
            <div className="space-y-2.5 text-xs text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
              <p>
                <strong className="text-white">Dénomination commerciale :</strong> PRINCE CFA
              </p>
              <p>
                <strong className="text-white">Secteur d&apos;activité :</strong> Distribution spécialisée en téléphonie haut de gamme, smartphones certifiés, informatique, équipement électroménager et électronique grand public.
              </p>
              <p>
                <strong className="text-white">Siège & Boutique physique :</strong> Koulouba, Ouagadougou, Burkina Faso.
              </p>
              <p>
                <strong className="text-white">Représentation légale :</strong> Direction Générale PRINCE CFA.
              </p>
            </div>
          </div>

          {/* Carte 2 : Coordonnées & Contact */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-gold/30 transition-all space-y-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Phone className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">2. Contacts & Service Client</h2>
              <p className="text-xs text-zinc-400 mt-1">Lignes officielles & assistance</p>
            </div>
            <div className="space-y-2.5 text-xs text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
              <p className="flex items-center gap-2">
                <span className="text-zinc-400">Téléphone principal :</span>
                <a href={`tel:${SHOP_CONFIG.phone}`} className="text-gold font-bold hover:underline">
                  {SHOP_CONFIG.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-zinc-400">Ligne secondaire :</span>
                <span className="text-white font-medium">+226 64 76 91 30</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-zinc-400">Ligne support :</span>
                <span className="text-white font-medium">+226 77 14 67 13</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-zinc-400">WhatsApp VIP 7j/7 :</span>
                <a 
                  href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>+{SHOP_CONFIG.whatsappNumber}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
              <p className="text-[11px] text-zinc-400 pt-1">
                Accueil physique à la boutique de Koulouba : Lundi au Samedi (9h - 19h) et Dimanche (10h - 16h).
              </p>
            </div>
          </div>

          {/* Carte 3 : Hébergement & Sécurité Technique */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-gold/30 transition-all space-y-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Server className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">3. Hébergement & Infrastructure</h2>
              <p className="text-xs text-zinc-400 mt-1">Serveurs et sécurisation du cloud</p>
            </div>
            <div className="space-y-2.5 text-xs text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
              <p>
                <strong className="text-white">Fournisseur d&apos;hébergement :</strong> Infrastructure Cloud distribuée à haute disponibilité (Vercel Inc. et Google Cloud Platform / Firebase).
              </p>
              <p>
                <strong className="text-white">Chiffrement & Protocoles :</strong> Tous les flux de communication sont sécurisés par certificat SSL/TLS 256 bits (HTTPS strict).
              </p>
              <p>
                <strong className="text-white">Base de données :</strong> Google Cloud Firestore avec règles d&apos;accès sécurisées et cloisonnées.
              </p>
            </div>
          </div>

          {/* Carte 4 : Paiements & Devises */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-gold/30 transition-all space-y-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <CreditCard className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">4. Devises & Règlements</h2>
              <p className="text-xs text-zinc-400 mt-1">Transactions transparentes et vérifiées</p>
            </div>
            <div className="space-y-2.5 text-xs text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
              <p>
                <strong className="text-white">Devise officielle :</strong> Tous les prix affichés sur la boutique en ligne sont exprimés en <strong>Francs CFA (XOF / XAF)</strong>.
              </p>
              <p>
                <strong className="text-white">Moyens de paiement acceptés :</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-zinc-300 pl-1">
                <li>Orange Money (dépôt ou transfert sécurisé)</li>
                <li>Wave (transfert instantané sans frais cachés)</li>
                <li>Paiement en espèces ou Mobile Money directement en Boutique</li>
              </ul>
              <p className="text-[11px] text-zinc-400 pt-1">
                Chaque achat fait l&apos;objet d&apos;un reçu de commande numérique et d&apos;une facture officielle délivrée avec le produit.
              </p>
            </div>
          </div>

        </div>

        {/* Sections Développées */}
        <div className="space-y-6">
          
          {/* Section Propriété Intellectuelle */}
          <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                5. Propriété Intellectuelle & Droits d&apos;Auteur
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              L&apos;ensemble des contenus présents sur le site web <strong>PRINCE CFA</strong> (structure, design, charte graphique, textes, logo, photographies, icônes et codes sources) relève de la législation burkinabè et internationale sur le droit d&apos;auteur et la propriété intellectuelle.
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Toute reproduction, représentation, diffusion ou exploitation totale ou partielle du contenu de ce site sans l&apos;accord préalable et écrit de la direction de <strong>PRINCE CFA</strong> est strictement interdite. Les marques des fabricants partenaires et produits présentés (tels que Apple, Samsung, Google, Xiaomi, Dell, HP, etc.) demeurent la propriété exclusive de leurs dépositaires légaux respectifs.
            </p>
          </section>

          {/* Section Garantie & Authenticité */}
          <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                6. Garantie des Produits & Authenticité
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              PRINCE CFA garantit l&apos;authenticité rigoureuse de tous les smartphones, appareils et accessoires mis en vente sur la plateforme. Tous nos produits sont vérifiés par des techniciens qualifiés avant mise à disposition ou livraison au client.
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              En cas de défectuosité matérielle avérée constatée dans les délais impartis par notre politique de garantie, le client bénéficie d&apos;une prise en charge au service après-vente (SAV) de notre boutique à Ouagadougou (Koulouba).
            </p>
          </section>

          {/* Section Juridiction & Droit Applicable */}
          <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                7. Droit Applicable & Résolution des Différends
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Les présentes mentions légales ainsi que l&apos;ensemble des relations commerciales issues de l&apos;utilisation du site sont régies par le droit en vigueur au <strong>Burkina Faso</strong> ainsi que par les actes uniformes de l&apos;Organisation pour l&apos;Harmonisation en Afrique du Droit des Affaires (OHADA).
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              En cas de réclamation ou de litige, nous encourageons vivement nos clients à contacter en premier lieu notre service d&apos;assistance afin de convenir d&apos;une solution amiable et rapide. À défaut d&apos;accord amiable, les tribunaux compétents de <strong>Ouagadougou</strong> seront seuls habilités à trancher le litige.
            </p>
          </section>

        </div>

        {/* Bannière de transition vers la Politique de Confidentialité */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg font-black text-white">
              Protection de votre Vie Privée
            </h3>
            <p className="text-xs text-zinc-300 max-w-xl">
              Découvrez en détail la manière dont PRINCE CFA protège vos données personnelles et garantit la confidentialité de vos commandes.
            </p>
          </div>
          <Link
            href="/politique-de-confidentialite"
            className="flex-shrink-0 px-6 py-3 rounded-xl bg-gold text-black font-extrabold text-xs uppercase tracking-wider hover:bg-gold-hover hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
          >
            Consulter la Confidentialité →
          </Link>
        </div>

      </main>

      {/* Footer Minimaliste & Épuré */}
      <footer className="border-t border-white/10 bg-[#060608] py-8 px-4 sm:px-8 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} PRINCE CFA. Koulouba, Ouagadougou. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-zinc-400">
            <Link href="/" className="hover:text-gold transition-colors">Accueil</Link>
            <span>•</span>
            <Link href="/mentions-legales" className="text-gold font-semibold hover:underline">Mentions Légales</Link>
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
