"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SHOP_CONFIG } from "@/config/shop";
import { 
  X, 
  Check, 
  Truck, 
  Clock, 
  Crown, 
  ArrowLeft, 
  Package, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Smartphone, 
  MapPin, 
  Store, 
  Phone, 
  RefreshCw 
} from "lucide-react";

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

interface OrderItem {
  name: string;
  quantity: number;
  selectedCapacity?: string | null;
  selectedColor?: string | null;
  unitPrice: number;
  image?: string;
}

interface OrderData {
  id: string;
  createdAt: string;
  updatedAt: string;
  orderStatus: string;
  customer: {
    name: string;
    deliveryMethod: string;
    city: string;
    neighborhood: string;
    phoneMasked: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    total: number;
    currency: string;
  };
  payment: {
    status: string;
    method: string;
    confirmedAt: string | null;
    transactionRef: string | null;
  };
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [orderId, setOrderId] = useState(initialId || initialPhone);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [multipleOrders, setMultipleOrders] = useState<OrderData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (searchId: string, searchPhone: string) => {
    const rawTerm = (searchId || searchPhone || orderId).trim();
    if (!rawTerm) {
      setError("Veuillez entrer votre référence de commande ou votre numéro de téléphone.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cleanDigits = (s: string) => (s || "").replace(/\D+/g, "");
      const params = new URLSearchParams();

      if (searchId.trim()) params.append("id", searchId.trim());
      if (searchPhone.trim()) params.append("phone", searchPhone.trim());

      // Si recherche globale sans paramètre précis
      if (!searchId && !searchPhone && rawTerm) {
        if (cleanDigits(rawTerm).length >= 6 && !rawTerm.toUpperCase().startsWith("CMD")) {
          params.append("phone", rawTerm);
        } else {
          params.append("id", rawTerm);
        }
      }
      params.append("q", rawTerm);

      const res = await fetch(`/api/orders/track?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Aucune commande trouvée.");
        setOrder(null);
        setMultipleOrders([]);
      } else {
        setOrder(data.order);
        if (Array.isArray(data.orders) && data.orders.length > 1) {
          setMultipleOrders(data.orders);
        } else {
          setMultipleOrders([]);
        }
        setError(null);
      }
    } catch {
      setError("Impossible de contacter le serveur. Veuillez vérifier votre connexion.");
      setOrder(null);
      setMultipleOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId || initialPhone) {
      fetchOrder(initialId, initialPhone);
    }
  }, [initialId, initialPhone]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = (s: string) => (s || "").replace(/\D+/g, "");
    const trimmed = orderId.trim();
    if (!trimmed) {
      setError("Veuillez entrer votre référence de commande ou votre numéro de téléphone.");
      return;
    }

    if (cleanDigits(trimmed).length >= 6 && !trimmed.toUpperCase().startsWith("CMD")) {
      setPhone(trimmed);
      fetchOrder("", trimmed);
    } else {
      fetchOrder(trimmed, "");
    }
  };

  // Déterminer l'état actuel de la timeline (0 à 4)
  const getProgressStep = (currentOrder: OrderData) => {
    if (currentOrder.orderStatus === "annule") return -1;
    if (currentOrder.orderStatus === "livre") return 4;
    if (currentOrder.orderStatus === "en_livraison") return 3;
    if (currentOrder.orderStatus === "paye_en_preparation" || currentOrder.payment.status === "confirme") return 2;
    return 1; // en attente de paiement
  };

  const getStatusBadge = (currentOrder: OrderData) => {
    if (currentOrder.orderStatus === "annule") {
      return { text: "Commande Annulée", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: <X className="w-4 h-4" aria-hidden="true" /> };
    }
    if (currentOrder.orderStatus === "livre") {
      return { text: "Commande Livrée", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", icon: <Check className="w-4 h-4" aria-hidden="true" /> };
    }
    if (currentOrder.orderStatus === "en_livraison") {
      return { text: "En cours de Livraison", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40", icon: <Truck className="w-4 h-4" aria-hidden="true" /> };
    }
    if (currentOrder.payment.status === "confirme" || currentOrder.orderStatus === "paye_en_preparation") {
      return { text: "Paiement Validé & En Préparation", color: "bg-green-500/20 text-green-300 border-green-500/40", icon: <Check className="w-4 h-4" aria-hidden="true" /> };
    }
    return { text: "Paiement En Attente de Vérification", color: "bg-amber-500/20 text-amber-300 border-amber-500/40", icon: <Clock className="w-4 h-4" aria-hidden="true" /> };
  };

  const currentStep = order ? getProgressStep(order) : 0;
  const statusBadge = order ? getStatusBadge(order) : null;

  const handleWhatsAppContact = (customMessage?: string) => {
    const text = customMessage || `Bonjour PRINCE CFA, je vous contacte concernant le suivi de ma commande *${order?.id || ""}*.`;
    window.open(`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-zinc-950 flex flex-col selection:bg-gold selection:text-black">
      {/* En-tête de la page */}
      <header className="border-b border-zinc-200 bg-white/85 backdrop-blur-xl sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Crown className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-600 to-yellow-600">
                PRINCE CFA
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 group-hover:text-gold transition-colors">
                Boutique Officielle
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border border-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Retour boutique</span>
            </Link>
            <a
              href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex text-xs px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold items-center gap-1.5 transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Contenu Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        
        {/* Titre et Formulaire de Recherche */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest">
            <Package className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
            <span>Portail Suivi de Commande</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            Suivez votre appareil <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600">en direct</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto font-normal">
            Entrez votre numéro de commande (ex: <code className="text-gold font-mono font-bold">CMD-20261021-XXXX</code>) ou le numéro de téléphone utilisé lors de votre achat.
          </p>

          {/* Formulaire de recherche */}
          <form onSubmit={handleSearch} className="pt-4 max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1 relative">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Référence (CMD-...) ou Téléphone"
                className="w-full py-3.5 px-4 rounded-2xl bg-white border border-zinc-200 focus:border-gold text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-all font-mono shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-gold to-yellow-500 text-black font-extrabold text-xs uppercase tracking-widest hover:brightness-105 active:scale-95 transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Recherche...</span>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Vérifier le statut</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs max-w-xl mx-auto animate-in fade-in flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {multipleOrders.length > 1 && (
            <div className="p-4 rounded-2xl bg-white border border-gold/30 max-w-xl mx-auto space-y-2.5 animate-in fade-in text-left shadow-sm">
              <div className="flex items-center justify-between text-xs text-zinc-700">
                <span className="font-semibold text-gold">Plusieurs commandes associées ({multipleOrders.length})</span>
                <span className="text-[10px] text-zinc-500">Cliquez pour basculer</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {multipleOrders.map((ord) => (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => setOrder(ord)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      order?.id === ord.id
                        ? "bg-gold text-black shadow-sm"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    {ord.id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AFFICHAGE DE LA COMMANDE TROUVÉE */}
        {order && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Carte En-tête Statut */}
            <div className="p-6 rounded-3xl bg-white border border-gold/30 shadow-md space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">
                    Référence Officielle PRINCE CFA
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-gold font-mono tracking-wider">
                    {order.id}
                  </div>
                  <span className="text-xs text-zinc-500 block mt-1">
                    Passée le {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {statusBadge && (
                  <div className={`px-4 py-2 rounded-2xl border font-black text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto ${statusBadge.color}`}>
                    <span className="text-base">{statusBadge.icon}</span>
                    <span>{statusBadge.text}</span>
                  </div>
                )}
              </div>

              {/* BARRE DE PROGRESSION VISUELLE (TIMELINE À 4 ÉTAPES) */}
              {order.orderStatus !== "annule" && (
                <div className="pt-2">
                  <div className="relative">
                    {/* Barre de fond */}
                    <div className="absolute top-5 left-6 right-6 h-1 bg-zinc-200 rounded-full -z-0">
                      {/* Remplissage actif */}
                      <div
                        className="h-full bg-gradient-to-r from-gold via-amber-500 to-emerald-500 rounded-full transition-all duration-700"
                        style={{
                          width: currentStep <= 1 ? "15%" : currentStep === 2 ? "50%" : currentStep === 3 ? "80%" : "100%"
                        }}
                      />
                    </div>

                    {/* Étapes */}
                    <div className="grid grid-cols-4 gap-2 relative z-10 text-center">
                      
                      {/* Étape 1 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                          currentStep >= 1 ? "bg-gold text-black border-2 border-white" : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                        }`}>
                          {currentStep >= 1 ? <Check className="w-5 h-5 text-black stroke-[3]" aria-hidden="true" /> : "1"}
                        </div>
                        <span className={`text-[11px] font-bold mt-2 ${currentStep >= 1 ? "text-gold" : "text-zinc-500"}`}>
                          Enregistrée
                        </span>
                        <span className="text-[9px] text-zinc-500 hidden sm:block">Commande reçue</span>
                      </div>

                      {/* Étape 2 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                          currentStep >= 2 ? "bg-emerald-500 text-white border-2 border-white" : currentStep === 1 ? "bg-amber-100 text-amber-700 border-2 border-amber-400 animate-pulse" : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                        }`}>
                          {currentStep >= 2 ? <Check className="w-5 h-5 text-white stroke-[3]" aria-hidden="true" /> : "2"}
                        </div>
                        <span className={`text-[11px] font-bold mt-2 ${currentStep >= 2 ? "text-emerald-600" : currentStep === 1 ? "text-amber-600" : "text-zinc-500"}`}>
                          Paiement
                        </span>
                        <span className="text-[9px] text-zinc-500 hidden sm:block">
                          {currentStep >= 2 ? "Validé" : "Vérification"}
                        </span>
                      </div>

                      {/* Étape 3 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                          currentStep >= 3 ? "bg-cyan-600 text-white border-2 border-white" : currentStep === 2 ? "bg-cyan-100 text-cyan-700 border-2 border-cyan-400" : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                        }`}>
                          {currentStep >= 3 ? <Check className="w-5 h-5 text-white stroke-[3]" aria-hidden="true" /> : "3"}
                        </div>
                        <span className={`text-[11px] font-bold mt-2 ${currentStep >= 3 ? "text-cyan-600" : currentStep === 2 ? "text-cyan-700" : "text-zinc-500"}`}>
                          Préparation
                        </span>
                        <span className="text-[9px] text-zinc-500 hidden sm:block">Colis scellé</span>
                      </div>

                      {/* Étape 4 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                          currentStep >= 4 ? "bg-emerald-600 text-white border-2 border-white" : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                        }`}>
                          {currentStep >= 4 ? <Check className="w-5 h-5 text-white stroke-[3]" aria-hidden="true" /> : "4"}
                        </div>
                        <span className={`text-[11px] font-bold mt-2 ${currentStep >= 4 ? "text-emerald-600" : "text-zinc-500"}`}>
                          {order.customer.deliveryMethod === "delivery" ? "Livrée" : "Remise"}
                        </span>
                        <span className="text-[9px] text-zinc-500 hidden sm:block">
                          {order.customer.deliveryMethod === "delivery" ? "À destination" : "En Boutique"}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* Message d'explication selon le statut */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                {order.payment.status === "confirme" ? (
                  <div className="space-y-1 text-xs">
                    <div className="text-emerald-600 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                      <span>Paiement reçu et vérifié par l&apos;équipe PRINCE CFA</span>
                    </div>
                    <p className="text-zinc-700 font-normal leading-relaxed">
                      Votre appareil a été réservé et votre paiement a été validé le{" "}
                      <strong>{order.payment.confirmedAt ? new Date(order.payment.confirmedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : "récemment"}</strong>.
                      {order.payment.transactionRef && (
                        <span> (Réf. transaction : <code className="text-gold font-mono font-bold">{order.payment.transactionRef}</code>)</span>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="text-amber-600 font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" aria-hidden="true" />
                      <span>Paiement en attente de validation</span>
                    </div>
                    <p className="text-zinc-700 font-normal leading-relaxed">
                      Si vous avez déjà envoyé votre transfert {order.payment.method === "wave" ? "Wave" : "Orange Money"}, nous vérifions actuellement votre SMS de débit sur notre téléphone marchand.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleWhatsAppContact(`Bonjour PRINCE CFA, voici la preuve de mon paiement pour la commande ${order.id}. Pouvez-vous vérifier ?`)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>Envoyer la capture du SMS sur WhatsApp</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Récapitulatif Articles & Livraison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Colonne 1 & 2 : Liste des articles */}
              <div className="md:col-span-2 p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-gold" aria-hidden="true" />
                  <span>Articles commandés ({order.items.reduce((s, i) => s + i.quantity, 0)})</span>
                </h3>

                <div className="divide-y divide-zinc-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <div className="font-bold text-zinc-950 text-sm">{item.name}</div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">
                            {[item.selectedCapacity, item.selectedColor].filter(Boolean).join(" • ")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-zinc-500 text-[11px]">{item.quantity} × {item.unitPrice.toLocaleString("fr-FR")} F</div>
                        <div className="font-black text-gold text-sm">{(item.quantity * item.unitPrice).toLocaleString("fr-FR")} FCFA</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-zinc-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Sous-total</span>
                    <span>{order.pricing.subtotal.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Frais de réception ({order.customer.deliveryMethod === "delivery" ? "Livraison" : "Retrait"})</span>
                    <span>{order.pricing.deliveryFee === 0 ? "Gratuit" : `${order.pricing.deliveryFee.toLocaleString("fr-FR")} FCFA`}</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 flex justify-between font-black text-sm">
                    <span className="text-zinc-950">Total réglé / attendu</span>
                    <span className="text-gold text-base">{order.pricing.total.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              </div>

              {/* Colonne 3 : Réception & Assistance */}
              <div className="space-y-4">
                
                {/* Mode de réception */}
                <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-3 text-xs">
                  <h4 className="font-black uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold" aria-hidden="true" />
                    <span>Mode de Réception</span>
                  </h4>

                  <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                    <div className="font-bold text-zinc-950 flex items-center gap-1.5">
                      {order.customer.deliveryMethod === "delivery" ? (
                        <>
                          <Truck className="w-4 h-4 text-gold" aria-hidden="true" />
                          <span>Livraison à domicile</span>
                        </>
                      ) : (
                        <>
                          <Store className="w-4 h-4 text-gold" aria-hidden="true" />
                          <span>Retrait en Boutique</span>
                        </>
                      )}
                    </div>
                    {order.customer.deliveryMethod === "delivery" ? (
                      <div className="text-zinc-600 leading-relaxed text-[11px]">
                        {order.customer.neighborhood ? `${order.customer.neighborhood}, ` : ""}{order.customer.city}
                      </div>
                    ) : (
                      <div className="text-zinc-600 text-[11px] leading-relaxed">
                        Boutique officielle PRINCE CFA à Ouagadougou.
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-zinc-600">
                    Client : <strong className="text-zinc-950">{order.customer.name}</strong>
                    {order.customer.phoneMasked && (
                      <span className="block font-mono text-[10px] text-zinc-500 mt-0.5">{order.customer.phoneMasked}</span>
                    )}
                  </div>
                </div>

                {/* Bouton Contact WhatsApp Direct */}
                <div className="p-5 rounded-3xl bg-emerald-50/50 border border-emerald-200 space-y-3 text-center shadow-sm">
                  <Crown className="w-8 h-8 text-gold mx-auto" aria-hidden="true" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800">
                      Service Client VIP
                    </h4>
                    <p className="text-[11px] text-zinc-600 mt-1 font-normal">
                      Une question ou besoin de contacter le livreur ?
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleWhatsAppContact()}
                    className="w-full py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Discuter sur WhatsApp</span>
                  </button>

                  <a
                    href={`tel:${SHOP_CONFIG.phone}`}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold border border-zinc-200 flex items-center justify-center gap-2 transition-colors block"
                  >
                    <Phone className="w-4 h-4 text-gold" aria-hidden="true" />
                    <span>Appeler {SHOP_CONFIG.displayPhone}</span>
                  </a>
                </div>

                {/* Bouton Rafraîchir */}
                <button
                  type="button"
                  onClick={() => fetchOrder(order.id, phone)}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Actualiser le statut</span>
                </button>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer minimaliste avec liens légaux */}
      <footer className="border-t border-zinc-200 bg-zinc-50 py-6 px-4 text-center text-xs text-zinc-500 space-y-2">
        <p>© {new Date().getFullYear()} PRINCE CFA. Boutique Premium Ouagadougou. Tous droits réservés.</p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-zinc-600 text-[11px]">
          <Link href="/a-propos" className="hover:text-gold transition-colors">À Propos</Link>
          <span>•</span>
          <Link href="/mentions-legales" className="hover:text-gold transition-colors">Mentions Légales</Link>
          <span>•</span>
          <Link href="/politique-de-confidentialite" className="hover:text-gold transition-colors">Politique de Confidentialité</Link>
          <span>•</span>
          <Link href="/" className="hover:text-gold transition-colors">Accueil Boutique</Link>
        </div>
      </footer>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center text-gold font-bold">
        Chargement du suivi de commande...
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}
