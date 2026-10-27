"use client";

import { useState, useEffect } from "react";
import { SHOP_CONFIG } from "@/config/shop";
import { getProductImageBg } from "@/lib/productValidation";
import { 
  X, 
  Crown, 
  ShieldCheck, 
  Store, 
  ShoppingBag, 
  Trash2, 
  Truck, 
  MapPin, 
  Compass, 
  Zap, 
  Check, 
  Copy, 
  Smartphone, 
  Phone, 
  Info, 
  AlertCircle, 
  Clock, 
  ExternalLink 
} from "lucide-react";

function OrangeMoneyIcon({ className = "w-5 h-5" }) {
  return (
    <img 
      src="/orange-money.png" 
      alt="Orange Money" 
      className={`${className} object-contain rounded-lg shadow-sm pointer-events-none select-none`} 
      loading="lazy"
    />
  );
}

function WaveIcon({ className = "w-5 h-5" }) {
  return (
    <img 
      src="/wave.png" 
      alt="Wave" 
      className={`${className} object-cover rounded-lg shadow-sm pointer-events-none select-none`} 
      loading="lazy"
    />
  );
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  updateQuantity, 
  removeItem,
  onClearCart,
  onViewProduct
}) {
  // Animation d'entrée slide-over
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setSlideIn(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setSlideIn(false);
    }
  }, [isOpen]);

  // Étapes simplifiées : 'order' (page unique fluide) | 'confirmed' (reçu WhatsApp)
  const [step, setStep] = useState("order");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedUssd, setCopiedUssd] = useState(false);
  const [omTab, setOmTab] = useState("ussd"); // "ussd" | "app"
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    city: "Ouagadougou",
    neighborhood: "",
    deliveryMethod: "delivery", // 'delivery' | 'pickup'
    paymentMethod: "orange_money", // 'orange_money' | 'wave' | 'store_pickup'
    transactionRef: "",
    notes: ""
  });

  // Calculs financiers rigoureux
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = customer.deliveryMethod === "delivery" ? SHOP_CONFIG.deliveryFee : 0;
  const totalPrice = subtotal + deliveryFee;

  // Méthode de paiement active selon configuration
  const activePaymentConfig = SHOP_CONFIG.paymentMethods[customer.paymentMethod] || SHOP_CONFIG.paymentMethods.orange_money;

  // Fonction de copie universelle (avec fallback pour mobile sur réseau local HTTP)
  const copyToClipboard = async (text, onSuccess) => {
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        textArea.setAttribute("readonly", "");
        document.body.appendChild(textArea);
        textArea.select();
        copied = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch {
        copied = false;
      }
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  // Copier le numéro marchand dans le presse-papier
  const handleCopyMerchantNumber = () => {
    const num = activePaymentConfig.number || SHOP_CONFIG.phone;
    copyToClipboard(num, () => {
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    });
  };

  // Copier le montant exact à payer
  const handleCopyAmount = () => {
    copyToClipboard(String(totalPrice), () => {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    });
  };

  // Code USSD interactif Orange Money (Burkina Faso) : *144*2*1*55443167*montant#
  const orangeNumber = SHOP_CONFIG.paymentMethods.orange_money?.merchantCode || SHOP_CONFIG.paymentMethods.orange_money?.number || "55443167";
  const ussdCodeString = `*144*2*1*${orangeNumber}*${totalPrice}#`;
  const telUssdUrl = `tel:*144*2*1*${orangeNumber}*${totalPrice}%23`;

  // Copier le code USSD complet
  const handleCopyUssd = () => {
    copyToClipboard(ussdCodeString, () => {
      setCopiedUssd(true);
      setTimeout(() => setCopiedUssd(false), 2000);
    });
  };

  // Copier le numéro de commande
  const handleCopyOrderId = (id) => {
    copyToClipboard(id, () => {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    });
  };

  // Génération du message WhatsApp officiel et encodé
  const generateWhatsAppMessage = (order) => {
    const o = order || confirmedOrder;
    if (!o) return "";

    const methodLabel = o.payment?.method === "wave" 
      ? "Wave" 
      : (o.payment?.method === "store_pickup" ? "Paiement en Boutique" : "Orange Money");

    const deliveryLabel = o.customer.deliveryMethod === "delivery" 
      ? `Livraison (${o.customer.city || "Ouaga"} - ${o.customer.neighborhood || "Non précisé"})`
      : "Retrait en Boutique";

    let msg = `👑 *COMMANDE PRINCE CFA* 👑\n`;
    msg += `═══════════════════════════\n`;
    msg += `▪ *Numéro de commande :* *${o.id}*\n`;
    msg += `▪ *Client :* ${o.customer.name} (${o.customer.phone})\n`;
    msg += `▪ *Mode de réception :* ${deliveryLabel}\n`;
    msg += `▪ *Paiement sélectionné :* ${methodLabel}\n`;
    if (o.payment?.transactionRef) {
      msg += `▪ *Réf. Transaction :* ${o.payment.transactionRef}\n`;
    }
    msg += `\n📦 *ARTICLES COMMANDÉS :*\n`;

    o.items.forEach((item, idx) => {
      const details = [item.selectedCapacity, item.selectedSimType, item.selectedColor].filter(Boolean).join(" | ");
      msg += `${idx + 1}. *${item.name}* ${details ? `(${details})` : ""}\n`;
      msg += `   ↳ Qté : ${item.quantity} × ${item.unitPrice.toLocaleString('fr-FR')} FCFA\n`;
    });

    msg += `\n💰 *MONTANT TOTAL :* *${o.pricing.total.toLocaleString('fr-FR')} FCFA*\n`;
    if (o.pricing.deliveryFee > 0) {
      msg += `   _(Dont frais de livraison : ${o.pricing.deliveryFee.toLocaleString('fr-FR')} FCFA)_\n`;
    }
    msg += `═══════════════════════════\n\n`;
    msg += `Bonjour Prince CFA, j'ai enregistré ma commande *${o.id}* sur le site. Merci de vérifier la réception de mon paiement et de lancer la préparation !`;

    return msg;
  };

  // Ouvrir WhatsApp avec message encodé
  const handleOpenWhatsApp = (order) => {
    const targetOrder = order || confirmedOrder;
    if (!targetOrder) return;
    const msg = generateWhatsAppMessage(targetOrder);
    const encoded = encodeURIComponent(msg);
    const url = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank");
  };

  // Soumission et enregistrement de la commande directe
  const handleCreateOrder = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    // Validations conviviales
    if (!customer.name.trim()) {
      setErrorMessage("Veuillez renseigner votre nom complet.");
      return;
    }
    if (!customer.phone.trim()) {
      setErrorMessage("Veuillez renseigner votre numéro de téléphone / WhatsApp.");
      return;
    }
    if (customer.deliveryMethod === "delivery") {
      if (!customer.city || !customer.city.trim()) {
        setErrorMessage("Veuillez indiquer votre ville pour la livraison.");
        return;
      }
      if (!customer.neighborhood || !customer.neighborhood.trim()) {
        setErrorMessage("Veuillez indiquer votre quartier ou repère pour la livraison.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: cartItems.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selectedCapacity: item.selectedCapacity || null,
            selectedSimType: item.selectedSimType || null,
            selectedColor: item.selectedColor || null,
            image: item.image || ""
          })),
          paymentMethod: customer.paymentMethod,
          transactionRef: customer.transactionRef
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de l'enregistrement de la commande.");
      }

      // Succès : sauvegarder la commande confirmée
      setConfirmedOrder(data.order);
      setStep("confirmed");

      // Vider le panier côté client pour éviter toute double commande
      if (onClearCart) {
        onClearCart();
      }

      // Tentative d'ouverture automatique de WhatsApp
      setTimeout(() => {
        handleOpenWhatsApp(data.order);
      }, 600);

    } catch (err) {
      console.error("Order submit error:", err);
      setErrorMessage(err.message || "Une erreur est survenue lors de la validation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (step === "confirmed") {
      setStep("order");
      setConfirmedOrder(null);
    }
    onClose();
  };

  if (!isOpen && !slideIn) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ease-out z-[100] ${slideIn && isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[520px] bg-white border-l border-zinc-200 shadow-[-20px_0_50px_rgba(0,0,0,0.15)] z-[110] transition-transform duration-300 ease-out flex flex-col will-change-transform ${slideIn && isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
              <Crown className="w-4 h-4 text-gold" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 uppercase tracking-widest">
                {step === "confirmed" ? "Commande Confirmée" : "Finaliser ma Commande"}
              </h2>
              {step !== "confirmed" && (
                <span className="text-[10px] text-gold font-semibold block">
                  Commande Express 1-Clic • Pas de formulaire complexe
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-gold/20 text-zinc-600 hover:text-gold transition-colors cursor-pointer touch-manipulation"
            title="Fermer"
            aria-label="Fermer le panier"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Badges de réassurance */}
        {step !== "confirmed" && (
          <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-zinc-50 border-b border-zinc-200 text-[11px] text-zinc-600">
            <div className="flex items-center justify-center gap-1.5 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
              <span>100% Authentique</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-center border-x border-zinc-200">
              <OrangeMoneyIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <WaveIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Paiement Direct</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-center">
              <Store className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
              <span>Boutique Ouaga</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ÉTAPE UNIQUE : TOUT SUR UNE SEULE PAGE FLUIDE ET RAPIDE  */}
        {/* ======================================================== */}
        {step !== "confirmed" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar">
            
            {/* Si le panier est vide */}
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 text-gold">
                  <ShoppingBag className="w-9 h-9 text-gold" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 mb-2">Votre panier est vide</h3>
                <p className="text-zinc-500 text-xs max-w-xs mb-6 font-light">
                  Découvrez nos smartphones, TV et équipements technologiques d&apos;exception.
                </p>
                <button 
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors shadow-md cursor-pointer touch-manipulation"
                >
                  Explorer le catalogue
                </button>
              </div>
            ) : (
              <>
                {/* 1. SECTION ARTICLES DU PANIER */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                      <span>1. Vos Articles ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">Modifiable</span>
                  </div>

                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div 
                        key={item.cartId || `${item.id}-${item.selectedColor}-${item.selectedCapacity}`}
                        className="p-3 rounded-2xl border border-zinc-200 flex gap-3 items-center relative group bg-zinc-50 hover:border-gold/40 hover:bg-zinc-100/60 transition-all shadow-sm"
                      >
                        {/* Zone interactive produit cliquable pour voir les détails complets */}
                        <div 
                          onClick={() => onViewProduct && onViewProduct(item)}
                          className="flex-1 flex gap-3 items-center min-w-0 cursor-pointer group/item select-none text-left"
                          title="Appuyer pour voir les détails de cet article"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onViewProduct && onViewProduct(item);
                            }
                          }}
                        >
                          <div className={`w-14 h-14 rounded-xl ${getProductImageBg(item, item.image).containerClass} p-1 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden border border-zinc-200 group-hover/item:border-gold/50 group-hover/item:scale-105 transition-all`}>
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs sm:text-sm font-bold text-zinc-950 truncate group-hover/item:text-gold transition-colors">
                                {item.name}
                              </h4>
                              <ExternalLink className="w-3 h-3 text-zinc-400 opacity-0 group-hover/item:opacity-100 group-hover/item:text-gold transition-all flex-shrink-0" aria-hidden="true" />
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-0.5">
                              {item.selectedCapacity && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/15 text-gold font-bold">
                                  {item.selectedCapacity}
                                </span>
                              )}
                              {item.selectedSimType && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                                  {item.selectedSimType}
                                </span>
                              )}
                              {item.selectedColor && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-200/80 text-zinc-700 font-medium">
                                  {item.selectedColor}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="text-xs font-black text-gold">
                                {item.price.toLocaleString('fr-FR')} FCFA
                              </div>
                              <span className="text-[10px] text-zinc-500 group-hover/item:text-gold font-medium flex items-center gap-0.5 transition-colors pr-2">
                                Voir détails →
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions : suppression et ajustement quantité */}
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pl-1 border-l border-zinc-200">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItem(item.cartId);
                            }}
                            className="text-zinc-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer touch-manipulation"
                            title="Supprimer"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <div 
                            className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg p-0.5 shadow-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(item.cartId, item.quantity - 1);
                              }}
                              className="w-5 h-5 flex items-center justify-center text-xs text-zinc-600 hover:text-zinc-950 rounded cursor-pointer touch-manipulation"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold w-4 text-center text-zinc-900">{item.quantity}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(item.cartId, item.quantity + 1);
                              }}
                              className="w-5 h-5 flex items-center justify-center text-xs text-zinc-600 hover:text-zinc-950 rounded cursor-pointer touch-manipulation"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. SECTION COORDONNÉES & LIVRAISON RAPIDE */}
                <div className="space-y-3 pt-3 border-t border-zinc-200">
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                    <span>2. Vos Coordonnées de Réception</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                        Nom & Prénom <span className="text-gold">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={customer.name}
                        onChange={e => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Ibrahim Ouédraogo"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gold focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                        Téléphone / WhatsApp <span className="text-gold">*</span>
                      </label>
                      <input 
                        type="tel" 
                        value={customer.phone}
                        onChange={e => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Ex: 07 77 87 40 ou +226..."
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gold focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Choix livraison à domicile ou retrait en boutique */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setCustomer(prev => ({ ...prev, deliveryMethod: "delivery" }))}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation ${
                        customer.deliveryMethod === "delivery" 
                          ? "bg-gold/15 border-gold text-gold font-extrabold shadow-sm" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                      }`}
                    >
                      <Truck className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <div className="text-left">
                        <span className="block text-xs leading-none">Livraison à domicile</span>
                        <span className="text-[9px] text-zinc-500">+{SHOP_CONFIG.deliveryFee.toLocaleString('fr-FR')} F</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomer(prev => ({ ...prev, deliveryMethod: "pickup" }))}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation ${
                        customer.deliveryMethod === "pickup" 
                          ? "bg-gold/15 border-gold text-gold font-extrabold shadow-sm" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                      }`}
                    >
                      <Store className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <div className="text-left">
                        <span className="block text-xs leading-none">Retrait en Boutique</span>
                        <span className="text-[9px] text-emerald-600 font-bold">Gratuit</span>
                      </div>
                    </button>
                  </div>

                  {/* Champs Ville & Quartier si livraison */}
                  {customer.deliveryMethod === "delivery" && (
                    <div className="space-y-2.5 animate-in fade-in">
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                          Ville <span className="text-gold">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={customer.city}
                          onChange={e => setCustomer(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Ex: Ouagadougou, Bobo-Dioulasso, Koudougou..."
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gold focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                          Quartier / Repère précis <span className="text-gold">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={customer.neighborhood}
                          onChange={e => setCustomer(prev => ({ ...prev, neighborhood: e.target.value }))}
                          placeholder="Ex: Ouaga 2000, Somgandé, face pharmacie..."
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gold focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Info boutique si retrait */}
                  {customer.deliveryMethod === "pickup" && (
                    <div className="p-3 rounded-xl bg-gold/10 border border-gold/30 text-xs text-zinc-700 flex items-center justify-between gap-2 animate-in fade-in">
                      <div>
                        <span className="font-bold text-gold flex items-center gap-1.5 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
                          Boutique Prince CFA (Koulouba)
                        </span>
                        <p className="text-zinc-600 text-[10px] mt-0.5">Koulouba, Ouagadougou • Burkina Faso</p>
                      </div>
                      <a 
                        href={SHOP_CONFIG.mapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-2.5 py-1 rounded-lg bg-gold text-black font-bold text-[10px] hover:bg-yellow-400 transition-colors shadow-sm flex items-center gap-1 flex-shrink-0"
                      >
                        <span>GPS</span>
                        <Compass className="w-3 h-3" aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </div>

                {/* 3. SECTION PAIEMENT INTÉGRÉE DIRECTEMENT DANS CETTE ZONE */}
                <div className="space-y-3 pt-3 border-t border-zinc-200">
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                    <span>3. Mode de Règlement Direct</span>
                  </span>

                  {/* Boutons de sélection Orange Money & Wave avec les vrais logos */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setCustomer(prev => ({ ...prev, paymentMethod: "orange_money" }))}
                      className={`py-3 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation select-none ${
                        customer.paymentMethod === "orange_money" 
                          ? "bg-orange-50 border-orange-500 text-orange-600 shadow-sm scale-[1.02]" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                      }`}
                    >
                      <OrangeMoneyIcon className="w-8 h-8 flex-shrink-0" />
                      <span className="font-extrabold text-sm pointer-events-none">Orange Money</span>
                      <span className="text-[10px] text-zinc-500 pointer-events-none">Dépôt ou transfert</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomer(prev => ({ ...prev, paymentMethod: "wave" }))}
                      className={`py-3 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation select-none ${
                        customer.paymentMethod === "wave" 
                          ? "bg-cyan-50 border-cyan-500 text-cyan-700 shadow-sm scale-[1.02]" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                      }`}
                    >
                      <WaveIcon className="w-8 h-8 flex-shrink-0" />
                      <span className="font-extrabold text-sm pointer-events-none">Wave</span>
                      <span className="text-[10px] text-zinc-500 pointer-events-none">Application Wave</span>
                    </button>
                  </div>

                  {/* Option Boutique si retrait */}
                  {customer.deliveryMethod === "pickup" && (
                    <button
                      type="button"
                      onClick={() => setCustomer(prev => ({ ...prev, paymentMethod: "store_pickup" }))}
                      className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation ${
                        customer.paymentMethod === "store_pickup" 
                          ? "bg-gold/15 border-gold text-gold font-extrabold" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                      }`}
                    >
                      <Store className="w-4 h-4 text-gold flex-shrink-0" aria-hidden="true" />
                      <span>Règlement sur place en Boutique (Espèces ou Mobile Money)</span>
                    </button>
                  )}

                  {/* Guichet interactif ORANGE MONEY */}
                  {customer.paymentMethod === "orange_money" && (
                    <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-4 shadow-sm space-y-3.5 animate-in fade-in duration-200">
                      
                      {/* En-tête Guichet */}
                      <div className="flex items-center justify-between border-b border-orange-200 pb-2.5">
                        <div className="flex items-center gap-2">
                          <OrangeMoneyIcon className="w-6 h-6 flex-shrink-0" />
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 leading-none">
                              Guichet Express Orange Money
                            </h4>
                            <span className="text-[10px] text-zinc-600">
                              Bénéficiaire : <strong className="text-zinc-900">PRINCE CFA</strong>
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 font-bold uppercase">
                          1-Clic
                        </span>
                      </div>

                      {/* Montant exact avec bouton copier */}
                      <div className="bg-white rounded-xl p-3 border border-orange-200 flex items-center justify-between gap-2 shadow-sm">
                        <div>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-medium">Montant net à régler</span>
                          <span className="text-base sm:text-lg font-black text-orange-600 font-mono">
                            {totalPrice.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyAmount}
                          className="px-2.5 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-bold border border-orange-300 transition-all flex items-center gap-1 cursor-pointer active:scale-95 touch-manipulation"
                        >
                          {copiedAmount ? (
                            <>
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Copié !</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Copier</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Code USSD direct pré-calculé */}
                      <div className="bg-white rounded-xl p-3 border border-orange-200 shadow-sm space-y-2">
                        <span className="text-[10px] text-zinc-500 font-medium block">
                          Code USSD direct pré-calculé :
                        </span>
                        <div className="p-2 rounded-lg bg-orange-50 border border-orange-200 font-mono text-center text-xs font-black text-orange-700 tracking-wider select-all break-all">
                          {ussdCodeString}
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <a
                            href={telUssdUrl}
                            className="py-2 px-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow hover:brightness-105 active:scale-95 transition-all text-center touch-manipulation"
                          >
                            <Phone className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                            <span>Composer</span>
                          </a>
                          <button
                            type="button"
                            onClick={handleCopyUssd}
                            className="py-2 px-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs flex items-center justify-center gap-1 border border-zinc-200 active:scale-95 transition-all cursor-pointer touch-manipulation"
                          >
                            {copiedUssd ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                                <span>Copié !</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
                                <span>Copier USSD</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Champ Référence SMS Orange Money */}
                      <div>
                        <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block mb-1">
                          Réf. SMS ou Numéro expéditeur (optionnel)
                        </label>
                        <input 
                          type="text" 
                          value={customer.transactionRef}
                          onChange={e => setCustomer(prev => ({ ...prev, transactionRef: e.target.value }))}
                          placeholder="Ex: CI260424... ou votre numéro Orange"
                          className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 transition-all font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Guichet interactif WAVE */}
                  {customer.paymentMethod === "wave" && (
                    <div className="rounded-2xl border border-cyan-200 bg-cyan-50/40 p-4 shadow-sm space-y-3.5 animate-in fade-in duration-200">
                      
                      {/* En-tête Guichet Wave */}
                      <div className="flex items-center justify-between border-b border-cyan-200 pb-2.5">
                        <div className="flex items-center gap-2">
                          <WaveIcon className="w-6 h-6 flex-shrink-0" />
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-700 leading-none">
                              Transfert Rapide Wave
                            </h4>
                            <span className="text-[10px] text-zinc-600">
                              Bénéficiaire : <strong className="text-zinc-900">PRINCE CFA</strong>
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 border border-cyan-200 font-bold uppercase">
                          App Wave
                        </span>
                      </div>

                      {/* Montant exact avec bouton copier */}
                      <div className="bg-white rounded-xl p-3 border border-cyan-200 shadow-sm flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-medium">Montant net à transférer</span>
                          <span className="text-base sm:text-lg font-black text-cyan-700 font-mono">
                            {totalPrice.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyAmount}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-100 hover:bg-cyan-200 text-cyan-700 text-xs font-bold border border-cyan-300 transition-all flex items-center gap-1 cursor-pointer active:scale-95 touch-manipulation"
                        >
                          {copiedAmount ? (
                            <>
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Copié !</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Copier</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Numéro officiel Wave */}
                      <div className="bg-white p-3 rounded-xl border border-cyan-200 shadow-sm flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-medium">Numéro officiel Wave</span>
                          <span className="text-sm sm:text-base font-black text-zinc-900 font-mono tracking-wider">{activePaymentConfig.displayNumber}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyMerchantNumber}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-100 hover:bg-cyan-200 text-cyan-700 text-xs font-bold transition-all border border-cyan-300 cursor-pointer active:scale-95 flex items-center gap-1 touch-manipulation"
                        >
                          {copiedNumber ? (
                            <>
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Copié !</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Copier</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Bouton direct Wave */}
                      <a
                        href={activePaymentConfig.appUrl || "https://wave.com"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm hover:brightness-105 active:scale-95 transition-all text-center touch-manipulation"
                      >
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Ouvrir l&apos;application Wave</span>
                      </a>

                      {/* Champ ID Wave */}
                      <div>
                        <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block mb-1">
                          ID Transaction Wave ou Numéro expéditeur (optionnel)
                        </label>
                        <input 
                          type="text" 
                          value={customer.transactionRef}
                          onChange={e => setCustomer(prev => ({ ...prev, transactionRef: e.target.value }))}
                          placeholder="Ex: W-123456789 ou votre numéro"
                          className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Encadré Boutique */}
                  {customer.paymentMethod === "store_pickup" && (
                    <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4 space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-gold flex-shrink-0" aria-hidden="true" />
                        <h4 className="text-xs font-black uppercase tracking-wider text-gold">
                          Paiement au Retrait en Boutique
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed font-light">
                        Votre appareil sera mis de côté pour vous. Vous pourrez régler en <strong>espèces</strong> ou par <strong>Orange Money / Wave</strong> sur place en Boutique.
                      </p>
                    </div>
                  )}

                  {/* Note de réassurance */}
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2 text-[11px] text-zinc-600">
                    <Info className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      Dès confirmation, votre commande sera scellée et instantanément partagée sur <strong>WhatsApp</strong> pour un suivi personnalisé avec notre équipe.
                    </span>
                  </div>

                  {/* Message d'erreur éventuel */}
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs animate-in fade-in flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" aria-hidden="true" />
                      <span className="font-medium">{errorMessage}</span>
                    </div>
                  )}
                </div>

                {/* 4. TOTAL NET & BOUTON UNIQUE DE COMMANDE (Situé tout en bas du formulaire, non flottant) */}
                <div className="pt-4 pb-8 border-t border-zinc-200 space-y-3 animate-in fade-in">
                  <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-zinc-200 bg-white shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-zinc-500 uppercase tracking-widest text-[10px] font-semibold block">Total Net à régler</span>
                      <span className="text-[11px] text-zinc-600 font-normal">
                        {customer.deliveryMethod === "delivery" ? "Livraison incluse" : "Retrait gratuit en boutique"}
                      </span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-600 to-yellow-600">
                      {totalPrice.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  <button 
                    type="button"
                    onClick={handleCreateOrder}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl border border-gold/40 bg-gradient-to-r from-gold via-yellow-500 to-yellow-600 text-black font-extrabold uppercase tracking-widest text-xs shadow-md active:scale-[0.98] hover:brightness-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 touch-manipulation select-none"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Enregistrement de votre commande...</span>
                    ) : (
                      <>
                        <span>Valider ma commande ({totalPrice.toLocaleString('fr-FR')} FCFA)</span>
                        <Crown className="w-4 h-4 text-black flex-shrink-0" aria-hidden="true" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-zinc-500 leading-tight">
                    En validant, vous acceptez nos{" "}
                    <a href="/mentions-legales" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-gold underline">mentions légales</a>
                    {" "}et notre{" "}
                    <a href="/politique-de-confidentialite" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-gold underline">politique de confidentialité</a>.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* ÉTAPE DE CONFIRMATION FINALE                             */}
        {/* ======================================================== */}
        {step === "confirmed" && confirmedOrder && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-gold/15 border-2 border-gold/40 flex items-center justify-center shadow-md animate-bounce">
              <Crown className="w-10 h-10 text-gold" aria-hidden="true" />
            </div>

            <div>
              <h3 className="text-xl font-black text-zinc-950">Commande Enregistrée !</h3>
              <p className="text-xs text-zinc-600 mt-1 max-w-xs mx-auto font-light">
                Votre commande a été scellée sur le serveur. Voici votre numéro unique :
              </p>
            </div>

            {/* Identifiant unique de commande */}
            <div className="p-4 rounded-2xl bg-white border border-gold/40 w-full max-w-xs shadow-md">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Référence de Commande</span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-lg font-black text-gold font-mono tracking-wider">{confirmedOrder.id}</span>
                <button
                  type="button"
                  onClick={() => handleCopyOrderId(confirmedOrder.id)}
                  className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer text-xs"
                  title="Copier la référence"
                  aria-label="Copier la référence"
                >
                  {copiedOrderId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>
              <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-[11px] text-amber-600 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                <span>Statut : En attente de vérification</span>
              </div>
            </div>

            {/* Récapitulatif montant & mode */}
            <div className="text-xs text-zinc-600 space-y-1">
              <div>Montant attendu : <strong className="text-zinc-900">{confirmedOrder.pricing.total.toLocaleString('fr-FR')} FCFA</strong></div>
              <div>Mode sélectionné : <strong className="text-gold font-bold uppercase">{confirmedOrder.payment.method}</strong></div>
            </div>

            {/* Bouton WhatsApp Principal */}
            <button
              type="button"
              onClick={() => handleOpenWhatsApp(confirmedOrder)}
              className="w-full py-4 rounded-2xl border border-[#25D366]/50 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-extrabold uppercase tracking-widest text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer touch-manipulation"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Envoyer sur WhatsApp officiel</span>
            </button>

            {/* Suivi en direct sur le site */}
            <a
              href={`/suivi?id=${encodeURIComponent(confirmedOrder.id)}&phone=${encodeURIComponent(customer.phone)}`}
              className="w-full py-3 px-4 rounded-2xl border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] touch-manipulation"
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>Suivre ma commande en direct sur le site</span>
            </a>

            {/* Solutions de secours en cas d'échec WhatsApp */}
            <div className="w-full pt-3 border-t border-zinc-200 space-y-2 text-center">
              <span className="text-[11px] text-zinc-500 block font-light">
                Si WhatsApp ne s&apos;ouvre pas automatiquement :
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const msg = generateWhatsAppMessage(confirmedOrder);
                    navigator.clipboard?.writeText(msg).then(() => alert("Message complet copié !"));
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold border border-zinc-200 transition-colors flex items-center justify-center gap-1.5 touch-manipulation"
                >
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copier le texte</span>
                </button>
                <a
                  href={`tel:${SHOP_CONFIG.phone}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold border border-gold/30 transition-colors flex items-center justify-center gap-1.5 touch-manipulation"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Appeler</span>
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-zinc-500 hover:text-zinc-900 underline transition-colors cursor-pointer pt-2 touch-manipulation"
            >
              Fermer et continuer mes achats
            </button>
          </div>
        )}


      </div>
    </>
  );
}
