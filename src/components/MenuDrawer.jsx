"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SHOP_CONFIG } from '@/config/shop';
import { 
  X, 
  Crown, 
  Smartphone, 
  Tv, 
  Laptop, 
  Speaker, 
  Bike, 
  SunMedium, 
  Store, 
  Package, 
  ShieldCheck, 
  ShoppingBag,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  Compass,
  Refrigerator,
  Tablet,
  Flame
} from 'lucide-react';

function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export default function MenuDrawer({
  isOpen,
  onClose,
  onSelectCategory,
  onSelectBrand,
  onOpenCart,
  cartCount = 0
}) {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setSlideIn(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setSlideIn(false);
    }
  }, [isOpen]);

  // Fermeture avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Bloquer le scroll du document quand le tiroir est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const categories = [
    { id: 'all', label: 'Toutes les collections', icon: Crown },
    { id: 'phones', label: 'Téléphones & Smartphones', icon: Smartphone },
    { id: 'computers', label: 'Ordinateurs & PC', icon: Laptop },
    { id: 'tablets', label: 'Tablettes & iPads', icon: Tablet },
    { id: 'tv', label: 'Téléviseurs & Smart TV', icon: Tv },
    { id: 'appliances', label: 'Électroménager & Maison', icon: Refrigerator },
    { id: 'tech', label: 'High-Tech & Accessoires', icon: Package },
    { id: 'audio', label: 'Boomers & Son Haute Fidélité', icon: Speaker },
    { id: 'mobility', label: 'Motos Électriques', icon: Bike },
    { id: 'solar', label: 'Énergie Solaire & Kits', icon: SunMedium },
    { id: 'promotion', label: 'PROMOTION & Bons Plans', icon: Flame },
  ];

  const phoneBrands = ['Iphones', 'Samsung', 'Redmi', 'Huawei', 'Tecno', 'Infinix', 'Honor', 'Itel', 'OALE'];

  const handleCategoryClick = (categoryId) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
    onClose();
    setTimeout(() => {
      if (categoryId === 'phones') {
        const subCatElem = document.getElementById('sous-categories-telephones');
        if (subCatElem) {
          subCatElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      const collectionElem = document.getElementById('collection');
      if (collectionElem) {
        collectionElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  const handleBrandClick = (brand) => {
    if (onSelectCategory) onSelectCategory('phones');
    if (onSelectBrand) onSelectBrand(brand);
    onClose();
    setTimeout(() => {
      const subCatElem = document.getElementById('sous-categories-telephones');
      if (subCatElem) {
        subCatElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      const collectionElem = document.getElementById('collection');
      if (collectionElem) {
        collectionElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };


  if (!isOpen && !slideIn) return null;

  return (
    <>
      {/* Arrière-plan assombri et flouté (Backdrop) */}
      <div 
        className={`fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300 ease-out z-[100] ${
          slideIn && isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Volet Latéral / Slide-Over Drawer depuis la droite */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] md:w-[480px] bg-white border-l border-zinc-200 shadow-[-20px_0_50px_rgba(0,0,0,0.15),-5px_0_20px_rgba(212,175,55,0.1)] z-[110] transition-transform duration-300 ease-out flex flex-col overflow-hidden will-change-transform ${
          slideIn && isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-drawer-title"
      >
        {/* Header du Menu Slide-Over */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 bg-white/95 backdrop-blur-md relative z-20">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-600 to-amber-700 tracking-wider">
              PRINCE CFA
            </span>
          </div>

          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-gold hover:border-gold/50 hover:bg-gold/10 transition-all duration-200 group"
            title="Fermer le menu (Échap)"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" aria-hidden="true" />
          </button>
        </div>

        {/* Contenu Défilable du Menu */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
          
          {/* Section Navigation Rapide */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              Rayons & Collections
            </h3>
            
            <div className="flex flex-col gap-2">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:border-gold/40 hover:bg-gold/5 text-left transition-all duration-200 group cursor-pointer"
                  >
                    <IconComponent className="w-5 h-5 text-gold flex-shrink-0 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                    <span className="text-sm font-semibold text-zinc-800 group-hover:text-gold transition-colors">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Marques de Téléphones Directes */}
          <div className="space-y-3 pt-4 border-t border-zinc-200">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                Marques Téléphones
              </h3>
              <span className="text-[10px] text-gold font-semibold uppercase tracking-wider">Sélection Pro</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {phoneBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandClick(brand)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white border border-zinc-200 text-zinc-700 hover:text-gold hover:border-gold/40 hover:bg-gold/10 transition-all duration-200 cursor-pointer shadow-sm"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Espace VIP & Liens Utiles */}
          <div className="space-y-3 pt-4 border-t border-zinc-200">
            <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              Services & Informations
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              <Link
                href="/a-propos"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:border-gold/40 hover:bg-gold/5 text-zinc-800 hover:text-gold transition-all duration-200 text-xs font-bold uppercase tracking-wider group"
              >
                <Crown className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
                <span>À PROPOS • L&apos;Histoire Prince CFA</span>
              </Link>

              <button
                onClick={() => {
                  onClose();
                  const elem = document.getElementById('about');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:border-gold/40 hover:bg-gold/5 text-zinc-800 hover:text-gold transition-all duration-200 text-xs font-bold uppercase tracking-wider group cursor-pointer"
              >
                <Store className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
                <span>Showroom & Horaires</span>
              </button>

              <Link
                href="/suivi"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-gold/10 border border-gold/30 hover:bg-gold/20 text-gold transition-all duration-200 text-xs font-bold uppercase tracking-wider group"
              >
                <Package className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
                <span>Suivre ma Commande</span>
              </Link>
            </div>
          </div>

          {/* Section NOUS JOINDRE */}
          <div className="space-y-3 pt-4 border-t border-zinc-200">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                <span>NOUS JOINDRE</span>
              </h3>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Burkina Faso</span>
            </div>

            {/* Numéros de Téléphone & WhatsApp */}
            <div className="grid grid-cols-1 gap-2">
              {(SHOP_CONFIG.phones || [
                { display: "+226 77 43 43 97", raw: "+22677434397", wa: "22677434397", isWhatsApp: true },
                { display: "+226 64 76 91 30", raw: "+22664769130" },
                { display: "+226 77 14 67 13", raw: "+22677146713" }
              ]).map((phoneItem, idx) => {
                const isWa = phoneItem.isWhatsApp || idx === 0;
                return (
                  <a
                    key={idx}
                    href={isWa ? `https://wa.me/${phoneItem.wa || '22677434397'}?text=Bonjour%20Prince%20CFA` : `tel:${phoneItem.raw}`}
                    target={isWa ? "_blank" : undefined}
                    rel={isWa ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 hover:border-gold/40 hover:bg-gold/10 text-zinc-800 hover:text-gold transition-all duration-200 group/phone"
                  >
                    <div className="flex items-center gap-2.5">
                      {isWa ? (
                        <WhatsAppIcon className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                      ) : (
                        <Phone className="w-4 h-4 text-gold flex-shrink-0" aria-hidden="true" />
                      )}
                      <span className="text-xs font-bold">{phoneItem.display}</span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 group-hover/phone:text-gold uppercase tracking-wider">
                      {isWa ? "WhatsApp" : "Appeler"}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Adresse & Itinéraire */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Koulouba, Ouagadougou</h4>
                  <p className="text-[11px] text-zinc-500">Boutique officielle • Ouagadougou</p>
                </div>
              </div>
              
              <a
                href={SHOP_CONFIG.directionsUrl || SHOP_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gold/10 border border-gold/30 hover:bg-gold hover:text-black text-gold text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Itinéraire Google Maps</span>
              </a>
            </div>

            {/* Horaires */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-gold font-bold text-[11px] uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Horaires d&apos;Ouverture</span>
              </div>
              <div className="flex justify-between text-zinc-700 text-[11px]">
                <span className="text-zinc-500">Lundi – Samedi :</span>
                <span className="font-semibold text-zinc-900">9 h – 19 h</span>
              </div>
              <div className="flex justify-between text-zinc-700 text-[11px]">
                <span className="text-zinc-500">Dimanche :</span>
                <span className="font-semibold text-gold">10 h – 16 h</span>
              </div>
            </div>
          </div>

        </div>

        {/* Pied du Drawer avec Accès Panier */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 relative z-20">
          <button
            onClick={() => {
              onClose();
              if (onOpenCart) onOpenCart();
            }}
            className="w-full py-3.5 px-4 rounded-xl border border-gold/40 bg-gradient-to-r from-gold to-yellow-600 text-black font-extrabold uppercase tracking-widest text-xs hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <ShoppingBag className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>Voir mon Panier ({cartCount})</span>
          </button>
        </div>
      </aside>
    </>
  );
}
