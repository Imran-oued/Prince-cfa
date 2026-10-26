import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  UserCheck, 
  Database, 
  Trash2, 
  BellRing, 
  ArrowLeft, 
  Phone, 
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { SHOP_CONFIG } from "@/config/shop";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | PRINCE CFA",
  description: "Politique officielle de confidentialité et protection des données personnelles de la boutique PRINCE CFA à Ouagadougou.",
};

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export default function PolitiqueConfidentialitePage() {
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
                Sécurité & Confidentialité
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
              href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=Bonjour%20Prince%20CFA,%20j'ai%20une%20question%20concernant%20mes%20donn%C3%A9es%20personnelles`}
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
            <ShieldCheck className="w-4 h-4 text-gold" aria-hidden="true" />
            <span>Vie Privée & Sécurité des Données</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Politique de <span className="text-gold">Confidentialité</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Chez <strong>PRINCE CFA</strong>, la protection de vos données personnelles et la discrétion de vos commandes sont des engagements fondamentaux de notre Maison.
          </p>
          <div className="pt-2 text-[11px] text-zinc-500 flex items-center justify-center gap-2">
            <span>Dernière révision : Février 2026</span>
            <span>•</span>
            <span className="text-gold font-semibold">Chiffrement SSL 256 bits</span>
          </div>
        </div>

        {/* 3 Grands Piliers d'Engagement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-bold text-white">Zéro Revente de Données</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Vos coordonnées ne sont jamais vendues, louées ou cédées à des courtiers de données ou régies publicitaires externes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-bold text-white">Chiffrement & Sécurité</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Vos transactions et commandes sont sauvegardées sur une infrastructure Google Cloud sécurisée avec accès strictement restreint.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <UserCheck className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-bold text-white">Contrôle Total</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Vous gardez le plein contrôle sur vos informations et pouvez exiger leur rectification ou suppression immédiate sur simple demande.
            </p>
          </div>
        </div>

        {/* Articles Détaillés */}
        <div className="space-y-6">

          {/* Article 1 : Données collectées */}
          <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                1. Quelles sont les Données que nous Collectons ?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Dans le cadre de votre utilisation de notre boutique en ligne et de la passation de vos commandes, nous collectons exclusivement les données nécessaires au bon acheminement de vos produits :
            </p>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Identité & Contact :</strong> Nom, prénom, numéro de téléphone (utilisé pour les appels du livreur et les confirmations WhatsApp).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Coordonnées de Livraison :</strong> Ville (ex : Ouagadougou), quartier, repères ou adresse pour la remise sécurisée en main propre.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Détails de la Commande :</strong> Modèle d&apos;appareil choisi, capacité de stockage, couleur, montant en Francs CFA, date et heure d&apos;achat.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Paiement Mobile Money / Boutique :</strong> Mode sélectionné (Orange Money, Wave, retrait en boutique) et référence de transaction fournie par le client pour validation comptable. <em>Nous ne demandons ni ne conservons jamais aucun code PIN ni identifiant bancaire secret.</em></span>
              </li>
            </ul>
          </section>

          {/* Article 2 : Finalités du traitement */}
          <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <BellRing className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                2. Pourquoi traitons-nous vos Données (Finalités) ?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Vos informations sont recueillies pour des objectifs précis et transparents :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-zinc-300">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-bold text-gold">Traitement & Expédition</span>
                <p className="text-zinc-400">Préparation de vos colis, assignation aux coursiers officiels et livraison rapide à votre destination.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-bold text-gold">Suivi de Commande en Temps Réel</span>
                <p className="text-zinc-400">Accès à notre portail de suivi en ligne permettant de vérifier le statut de préparation et de transit de votre achat.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-bold text-gold">Service Client & SAV VIP</span>
                <p className="text-zinc-400">Assistance personnalisée par WhatsApp ou appel pour vos questions techniques, garanties et conseils d&apos;utilisation.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-bold text-gold">Conformité Légale & Facturation</span>
                <p className="text-zinc-400">Émission de votre facture officielle avec justificatif de garantie fabricant.</p>
              </div>
            </div>
          </section>

          {/* Article 3 : Destinataires & Absence de revente */}
          <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                3. Destinataires des Données & Confidentialité
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Seul le personnel expressément habilité de <strong>PRINCE CFA</strong> (service logistique, service client et direction) a accès aux informations nécessaires à l&apos;exécution de votre commande.
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Nos partenaires de livraison reçoivent exclusivement les données indispensables à l&apos;acheminement du colis (nom, téléphone, adresse de livraison). Aucun transfert de données hors du cadre strict de notre activité commerciale n&apos;est toléré.
            </p>
          </section>

          {/* Article 4 : Durée de conservation */}
          <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                4. Durée de Conservation des Données
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Les données relatives à vos commandes sont conservées pendant toute la durée nécessaire au suivi commercial, à l&apos;application des garanties matérielles sur vos appareils (généralement 1 à 2 ans selon le modèle), ainsi qu&apos;aux obligations légales comptables en vigueur au Burkina Faso.
            </p>
          </section>

          {/* Article 5 : Vos Droits et Contact DPO */}
          <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                5. Vos Droits (Accès, Rectification, Suppression)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Vous disposez à tout moment d&apos;un droit d&apos;accès, de consultation, de rectification ou de suppression des données personnelles vous concernant. Pour exercer ces droits, vous pouvez nous contacter directement par l&apos;un des canaux suivants :
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <span className="text-gold font-bold">Via WhatsApp :</span>
                <a 
                  href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=Bonjour,%20je%20souhaite%20consulter%20ou%20supprimer%20mes%20donn%C3%A9es`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-bold hover:underline"
                >
                  +{SHOP_CONFIG.whatsappNumber}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gold font-bold">Par Appel Téléphonique :</span>
                <a href={`tel:${SHOP_CONFIG.phone}`} className="text-white hover:underline">
                  {SHOP_CONFIG.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gold font-bold">Directement en Boutique :</span>
                <span className="text-zinc-300">PRINCE CFA, Koulouba, Ouagadougou, Burkina Faso</span>
              </p>
            </div>
          </section>

          {/* Article 6 : Cookies et Stockage Local */}
          <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                6. Cookies & Technologies de Stockage Local
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Notre site web utilise uniquement des cookies et mécanismes de stockage local (localStorage / sessionStorage) strictement indispensables à la bonne navigation :
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-zinc-400 pl-2">
              <li>Mémorisation des articles ajoutés à votre panier</li>
              <li>Sauvegarde de vos préférences de langue et de devises (Franc CFA)</li>
              <li>Sécurisation des requêtes contre les attaques automatisées</li>
            </ul>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-1">
              Nous n&apos;utilisons aucun cookie tiers intrusif à des fins d&apos;espionnage ou de revente publicitaire.
            </p>
          </section>

        </div>

        {/* Liens transversaux & Assistance */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg font-black text-white">
              Une question concernant vos données ?
            </h3>
            <p className="text-xs text-zinc-300 max-w-xl">
              Notre équipe d&apos;assistance est disponible 7j/7 pour répondre à toutes vos interrogations en toute transparence.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/mentions-legales"
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all"
            >
              Mentions Légales
            </Link>
            <a
              href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gold text-black font-extrabold text-xs uppercase tracking-wider hover:bg-gold-hover hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Contacter sur WhatsApp</span>
            </a>
          </div>
        </div>

      </main>

      {/* Footer Minimaliste & Épuré */}
      <footer className="border-t border-white/10 bg-[#060608] py-8 px-4 sm:px-8 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 PRINCE CFA. Koulouba, Ouagadougou. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-zinc-400">
            <Link href="/" className="hover:text-gold transition-colors">Accueil</Link>
            <span>•</span>
            <Link href="/mentions-legales" className="hover:text-gold transition-colors">Mentions Légales</Link>
            <span>•</span>
            <Link href="/politique-de-confidentialite" className="text-gold font-semibold hover:underline">Politique de Confidentialité</Link>
            <span>•</span>
            <Link href="/suivi" className="hover:text-gold transition-colors">Suivi Commande</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
